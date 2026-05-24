import { ref, computed } from 'vue'
import { supabase } from '../lib/supabase'
import { albumOrder } from '../lib/categoryMap'

// Global cache for stickers catalog
const catalogStickers = ref([])
const catalogLoading = ref(false)

export function useStickers(collectionId) {
  const collectionStickers = ref([])
  const loading = ref(false)
  let subscription = null

  const fetchCatalog = async () => {
    if (catalogStickers.value.length > 0) return

    catalogLoading.value = true
    const { data, error } = await supabase
      .from('stickers')
      .select('*')
    
    if (data) {
      // Sort: according to album order, then by code within.
      data.sort((a, b) => {
        if (a.category !== b.category) {
          const indexA = albumOrder.indexOf(a.category);
          const indexB = albumOrder.indexOf(b.category);
          
          // Fallback if category is not in the list (put it at the end)
          const weightA = indexA !== -1 ? indexA : 999;
          const weightB = indexB !== -1 ? indexB : 999;
          
          if (weightA !== weightB) return weightA - weightB;
          return a.category.localeCompare(b.category);
        }
        return a.code.localeCompare(b.code, undefined, { numeric: true });
      })
      catalogStickers.value = data
    }
    catalogLoading.value = false
  }

  const fetchCollectionProgress = async () => {
    if (!collectionId) return

    loading.value = true
    const { data, error } = await supabase
      .from('collection_stickers')
      .select('sticker_code, count')
      .eq('collection_id', collectionId)

    if (data) {
      collectionStickers.value = data
    }
    loading.value = false
  }

  const getCount = (code) => {
    const item = collectionStickers.value.find(s => s.sticker_code === code)
    return item ? item.count : 0
  }

  const updateCount = async (code, increment) => {
    if (!collectionId) return

    const currentCount = getCount(code)
    const newCount = Math.max(0, currentCount + increment)

    // Optimistic update locally
    const existingIndex = collectionStickers.value.findIndex(s => s.sticker_code === code)
    if (existingIndex >= 0) {
      collectionStickers.value[existingIndex].count = newCount
    } else {
      collectionStickers.value.push({ sticker_code: code, count: newCount })
    }

    // Update database using upsert
    // Needs a unique constraint on (collection_id, sticker_code) in Postgres
    // Assuming 'id' is pk, upsert by specific constraint might be needed, 
    // or if we rely on a composite unique key (collection_id, sticker_code):
    const { error } = await supabase
      .from('collection_stickers')
      .upsert({
        collection_id: collectionId,
        sticker_code: code,
        count: newCount,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'collection_id, sticker_code' // Important: depends on DB schema
      })

    if (error) {
      console.error('Error updating sticker count:', error)
      // Optional: rollback optimistic update on error
    }
  }

  const subscribeToChanges = () => {
    if (!collectionId) return

    subscription = supabase
      .channel(`public:collection_stickers:collection_id=eq.${collectionId}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'collection_stickers',
        filter: `collection_id=eq.${collectionId}` 
      }, (payload) => {
        const { eventType, new: newRecord } = payload
        
        if (eventType === 'INSERT' || eventType === 'UPDATE') {
          const index = collectionStickers.value.findIndex(s => s.sticker_code === newRecord.sticker_code)
          if (index >= 0) {
            collectionStickers.value[index].count = newRecord.count
          } else {
            collectionStickers.value.push({
              sticker_code: newRecord.sticker_code,
              count: newRecord.count
            })
          }
        } else if (eventType === 'DELETE') {
          collectionStickers.value = collectionStickers.value.filter(s => s.sticker_code !== payload.old.sticker_code)
        }
      })
      .subscribe()
  }

  const unsubscribe = () => {
    if (subscription) {
      supabase.removeChannel(subscription)
      subscription = null
    }
  }

  return {
    catalogStickers,
    catalogLoading,
    collectionStickers,
    loading,
    fetchCatalog,
    fetchCollectionProgress,
    getCount,
    updateCount,
    subscribeToChanges,
    unsubscribe
  }
}
