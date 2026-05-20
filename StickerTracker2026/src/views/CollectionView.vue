<script setup>
import { onMounted, onUnmounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from '../components/Navbar.vue'
import StickerCard from '../components/StickerCard.vue'
import { useStickers } from '../composables/useStickers'
import { useAuth } from '../composables/useAuth'
import { getCategoryName } from '../lib/categoryMap'

const route = useRoute()
const collectionId = route.params.id

const { initAuth } = useAuth()
const { 
  catalogStickers, 
  catalogLoading, 
  loading,
  fetchCatalog, 
  fetchCollectionProgress, 
  getCount, 
  updateCount, 
  subscribeToChanges, 
  unsubscribe 
} = useStickers(collectionId)

const selectedCategory = ref('ALL')
const selectedStatus = ref('ALL') // 'ALL', 'MISSING', 'DUPLICATES'

// By default open on large screens, closed on small screens
const filtersOpen = ref(window.innerWidth >= 1024)

onMounted(async () => {
  await initAuth()
  await fetchCatalog()
  await fetchCollectionProgress()
  subscribeToChanges()
})

onUnmounted(() => {
  unsubscribe()
})

const categories = computed(() => {
  if (!catalogStickers.value.length) return []
  const unique = new Set(catalogStickers.value.map(s => s.category))
  return ['ALL', ...unique]
})

const filteredStickers = computed(() => {
  let result = catalogStickers.value

  // Filtro de Categoria
  if (selectedCategory.value !== 'ALL') {
    result = result.filter(s => s.category === selectedCategory.value)
  }

  // Filtro de Status
  if (selectedStatus.value === 'MISSING') {
    result = result.filter(s => getCount(s.code) === 0)
  } else if (selectedStatus.value === 'DUPLICATES') {
    result = result.filter(s => getCount(s.code) > 1)
  } else if (selectedStatus.value === 'OWNED') {
    result = result.filter(s => getCount(s.code) > 0)
  }

  return result
})

const handleUpdateSticker = (code, increment) => {
  updateCount(code, increment)
}

const isCopying = ref(false)

const copyToClipboard = async () => {
  if (!catalogStickers.value.length) return
  isCopying.value = true

  let totalOwned = 0
  let totalMissing = 0
  let totalDuplicates = 0
  const totalUnique = catalogStickers.value.length

  const missingCategories = []
  const duplicatesCategories = []
  const missingByCategory = {}
  const duplicatesByCategory = {}

  catalogStickers.value.forEach(s => {
    const count = getCount(s.code)
    if (count === 0) {
      totalMissing++
      if (!missingByCategory[s.category]) {
        missingByCategory[s.category] = []
        missingCategories.push(s.category)
      }
      missingByCategory[s.category].push(s.code)
    } else {
      totalOwned++
      if (count > 1) {
        const dups = count - 1
        totalDuplicates += dups
        if (!duplicatesByCategory[s.category]) {
          duplicatesByCategory[s.category] = []
          duplicatesCategories.push(s.category)
        }
        
        let text = s.code
        if (dups > 1) {
          text += ` (×${dups})`
        }
        duplicatesByCategory[s.category].push(text)
      }
    }
  })

  const percentage = Math.floor((totalOwned / totalUnique) * 100)
  let text = `🏆 Copa 2026 — ❌ Faltam ${totalMissing} — 🔁 ${totalDuplicates} Repetidas — ${totalOwned}/${totalUnique} (${percentage}%)\n\n`

  if (totalMissing > 0) {
    text += `❌ Faltam\n`
    missingCategories.forEach(cat => {
      text += `${getCategoryName(cat)}:\n${missingByCategory[cat].join(', ')}\n\n`
    })
  }

  if (totalDuplicates > 0) {
    text += `🔁 Repetidas\n`
    duplicatesCategories.forEach(cat => {
      text += `${getCategoryName(cat)}:\n${duplicatesByCategory[cat].join(', ')}\n\n`
    })
  }

  try {
    await navigator.clipboard.writeText(text.trim())
    setTimeout(() => {
      isCopying.value = false
    }, 2000)
  } catch (err) {
    console.error('Falha ao copiar: ', err)
    isCopying.value = false
    alert('Erro ao copiar o resumo.')
  }
}
</script>

<template>
  <div class="min-h-screen bg-[#f4f4f0] text-black font-sans selection:bg-[#ff003c]/30">
    <Navbar />

    <main class="w-full px-4 sm:px-8 py-10 max-w-[1800px] mx-auto">
      
      <div v-if="catalogLoading || loading" class="flex justify-center items-center py-32">
        <div class="w-24 h-24 bg-[#ff003c] border-8 border-black shadow-[12px_12px_0px_#000] flex items-center justify-center animate-spin">
          <div class="w-12 h-12 bg-black"></div>
        </div>
      </div>

      <div v-else>
        <!-- Filtros Principais com Sticky Header -->
        <div class="sticky top-[90px] sm:top-[96px] z-40 bg-[#f4f4f0] pt-4 pb-4 -mx-4 px-4 sm:-mx-8 sm:px-8 mb-10 border-b-8 border-black shadow-[0px_8px_0px_rgba(0,0,0,0.1)]">
          
          <!-- Toggle Button & Mini Progress -->
          <div class="flex items-center justify-between mb-2">
            <button 
              @click="filtersOpen = !filtersOpen"
              class="flex items-center gap-3 bg-[#ffcf00] border-4 border-black px-4 py-2 font-black uppercase text-base sm:text-lg shadow-[4px_4px_0px_#000] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_#000] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all"
            >
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path v-if="!filtersOpen" stroke-linecap="square" stroke-linejoin="miter" stroke-width="3" d="M4 6h16M4 12h16M4 18h16" />
                <path v-else stroke-linecap="square" stroke-linejoin="miter" stroke-width="3" d="M6 18L18 6M6 6l12 12" />
              </svg>
              {{ filtersOpen ? 'FECHAR FILTROS' : 'ABRIR FILTROS' }}
            </button>

            <!-- Progress visibility when filters are hidden (optional) -->
            <div v-if="!filtersOpen" class="text-lg font-black text-black bg-white px-4 py-2 border-4 border-black shadow-[4px_4px_0px_#000] uppercase hidden sm:block">
              COMPLETO: <span class="text-[#ff003c]">{{ catalogStickers.filter(s => getCount(s.code) > 0).length }} / {{ catalogStickers.length }}</span>
            </div>
            <!-- Smaller progress for mobile when filters are hidden -->
            <div v-if="!filtersOpen" class="text-sm font-black text-black bg-white px-2 py-1 border-4 border-black shadow-[2px_2px_0px_#000] uppercase sm:hidden block">
              <span class="text-[#ff003c]">{{ catalogStickers.filter(s => getCount(s.code) > 0).length }}</span>/{{ catalogStickers.length }}
            </div>
          </div>

          <!-- Gaveta (Drawer) dos Filtros -->
          <div v-show="filtersOpen" class="mt-6 border-t-4 border-black pt-6 animate-[fadeIn_0.2s_ease-out]">
            <div class="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-6">
              
              <!-- Tabs de Status -->
              <div class="flex flex-wrap items-center gap-3 w-full xl:w-auto">
                <button 
                  @click="selectedStatus = 'ALL'"
                  class="flex-1 sm:flex-initial px-6 py-4 text-lg font-black uppercase transition-all border-4 border-black"
                  :class="selectedStatus === 'ALL' ? 'bg-black text-white shadow-[6px_6px_0px_#ffcf00] -translate-y-1' : 'bg-white text-black hover:bg-gray-100 shadow-[6px_6px_0px_#000]'"
                >
                  Todas
                </button>
                <button 
                  @click="selectedStatus = 'OWNED'"
                  class="flex-1 sm:flex-initial px-6 py-4 text-lg font-black uppercase transition-all border-4 border-black"
                  :class="selectedStatus === 'OWNED' ? 'bg-[#00e5ff] text-black shadow-[6px_6px_0px_#000] -translate-y-1' : 'bg-white text-black hover:bg-gray-100 shadow-[6px_6px_0px_#000]'"
                >
                  Adquiridas
                </button>
                <button 
                  @click="selectedStatus = 'MISSING'"
                  class="flex-1 sm:flex-initial px-6 py-4 text-lg font-black uppercase transition-all border-4 border-black"
                  :class="selectedStatus === 'MISSING' ? 'bg-[#ffcf00] text-black shadow-[6px_6px_0px_#000] -translate-y-1' : 'bg-white text-black hover:bg-gray-100 shadow-[6px_6px_0px_#000]'"
                >
                  Faltantes
                </button>
                <button 
                  @click="selectedStatus = 'DUPLICATES'"
                  class="flex-1 sm:flex-initial px-6 py-4 text-lg font-black uppercase transition-all border-4 border-black"
                  :class="selectedStatus === 'DUPLICATES' ? 'bg-[#ff003c] text-white shadow-[6px_6px_0px_#000] -translate-y-1' : 'bg-white text-black hover:bg-gray-100 shadow-[6px_6px_0px_#000]'"
                >
                  Repetidas
                </button>
              </div>
              
              <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full xl:w-auto mt-4 xl:mt-0">
                <div class="text-2xl font-black text-black bg-white px-8 py-4 border-4 border-black w-full sm:w-auto text-center shadow-[6px_6px_0px_#000] uppercase">
                  COMPLETO: <span class="text-[#ff003c]">{{ catalogStickers.filter(s => getCount(s.code) > 0).length }} / {{ catalogStickers.length }}</span>
                </div>
                <button 
                  @click="copyToClipboard"
                  class="flex items-center justify-center gap-3 bg-[#00e5ff] text-black px-10 py-5 border-4 border-black shadow-[6px_6px_0px_#000] hover:-translate-y-1 hover:shadow-[8px_8px_0px_#000] active:translate-y-[2px] active:shadow-none transition-all text-xl font-black uppercase"
                  :title="isCopying ? 'COPIADO!' : 'COPIAR RESUMO'"
                >
                  <span v-if="!isCopying">COPIAR RESUMO</span>
                  <span v-else class="text-white bg-black px-3 py-1">COPIADO!</span>
                </button>
              </div>
            </div>

            <!-- Filtro de Categorias -->
            <div class="mt-8 border-t-8 border-dashed border-black pt-6">
              <h2 class="text-3xl font-black text-black uppercase tracking-tighter mb-6 bg-[#ffcf00] inline-block px-4 py-2 border-4 border-black transform -rotate-1 shadow-[4px_4px_0px_#000]">
                CATEGORIAS
              </h2>
              <div class="flex gap-4 overflow-x-auto pb-6 pt-2 snap-x scrollbar-thin scrollbar-thumb-black scrollbar-track-transparent">
                <button
                  v-for="category in categories"
                  :key="category"
                  @click="selectedCategory = category"
                  class="snap-start shrink-0 px-8 py-5 text-xl font-black uppercase tracking-wider transition-all border-4 border-black"
                  :class="[
                    selectedCategory === category
                      ? 'bg-black text-white shadow-[8px_8px_0px_#ff003c] -translate-y-2 rotate-1'
                      : 'bg-white text-black shadow-[6px_6px_0px_#000] hover:-translate-y-1 hover:bg-gray-100'
                  ]"
                >
                  {{ getCategoryName(category) }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Grid de Figurinhas -->
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-6 sm:gap-8">
          <StickerCard 
            v-for="sticker in filteredStickers"
            :key="sticker.code"
            :sticker="sticker"
            :count="getCount(sticker.code)"
            @update="increment => handleUpdateSticker(sticker.code, increment)"
          />
        </div>

        <!-- Empty State -->
        <div v-if="filteredStickers.length === 0" class="text-center py-32 bg-white border-8 border-black shadow-[16px_16px_0px_#000] mt-12 relative overflow-hidden">
          <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')] opacity-10"></div>
          <div class="relative z-10 inline-flex items-center justify-center w-32 h-32 bg-black text-white mb-8 border-4 border-black transform -rotate-6 shadow-[8px_8px_0px_#ff003c]">
            <svg class="w-16 h-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="square" stroke-linejoin="miter" stroke-width="3" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h3 class="text-5xl font-black text-black uppercase relative z-10 bg-[#ffcf00] inline-block px-6 py-2 border-y-4 border-black">Nenhuma figurinha aqui!</h3>
          <p class="text-3xl text-black font-bold mt-8 relative z-10 uppercase bg-white border-4 border-black inline-block px-4 py-2">Mude a categoria ou o filtro de status.</p>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
