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
  <div class="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-green-500/30">
    <Navbar />

    <main class="w-full px-6 py-10">
      
      <div v-if="catalogLoading || loading" class="flex justify-center items-center py-20">
        <svg class="w-8 h-8 animate-spin text-green-500" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>

      <div v-else>
        <!-- Filtros Principais -->
        <div class="mb-10 space-y-6">
          <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            
            <!-- Tabs de Status -->
            <div class="bg-zinc-900 p-1 rounded-xl flex items-center border border-white/5 w-full sm:w-auto">
              <button 
                @click="selectedStatus = 'ALL'"
                class="flex-1 sm:flex-initial px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all text-center"
                :class="selectedStatus === 'ALL' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'"
              >
                Todas
              </button>
              <button 
                @click="selectedStatus = 'OWNED'"
                class="flex-1 sm:flex-initial px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all text-center"
                :class="selectedStatus === 'OWNED' ? 'bg-blue-500/20 text-blue-300 shadow-sm' : 'text-zinc-400 hover:text-zinc-200'"
              >
                Adquiridas
              </button>
              <button 
                @click="selectedStatus = 'MISSING'"
                class="flex-1 sm:flex-initial px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all text-center"
                :class="selectedStatus === 'MISSING' ? 'bg-yellow-500/20 text-yellow-300 shadow-sm' : 'text-zinc-400 hover:text-zinc-200'"
              >
                Faltantes
              </button>
              <button 
                @click="selectedStatus = 'DUPLICATES'"
                class="flex-1 sm:flex-initial px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all text-center"
                :class="selectedStatus === 'DUPLICATES' ? 'bg-green-500/20 text-green-300 shadow-sm' : 'text-zinc-400 hover:text-zinc-200'"
              >
                Repetidas
              </button>
            </div>
            
            <div class="flex items-center gap-2 w-full sm:w-auto">
              <div class="text-xs sm:text-sm font-medium text-zinc-400 bg-zinc-900 px-4 py-2 rounded-xl border border-white/5 w-full sm:w-auto text-center">
                Completado: <span class="text-white">{{ catalogStickers.filter(s => getCount(s.code) > 0).length }} / {{ catalogStickers.length }}</span>
              </div>
              <button 
                @click="copyToClipboard"
                class="flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white px-4 py-2 rounded-xl border border-white/5 transition-all text-sm font-medium whitespace-nowrap"
                :title="isCopying ? 'Copiado!' : 'Copiar Resumo'"
              >
                <svg v-if="!isCopying" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                <svg v-else class="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span class="hidden sm:inline">{{ isCopying ? 'Copiado!' : 'Copiar Resumo' }}</span>
              </button>
            </div>
          </div>

          <!-- Filtro de Categorias -->
          <div>
            <h2 class="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3">
              Categorias
            </h2>
            <div class="flex gap-3 overflow-x-auto pb-4 pt-1 snap-x scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              <button
                v-for="category in categories"
                :key="category"
                @click="selectedCategory = category"
                class="snap-start shrink-0 px-5 py-2 rounded-full text-xs font-bold transition-all duration-300 border backdrop-blur-sm"
                :class="[
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white border-transparent shadow-lg shadow-green-500/25 scale-105'
                    : 'bg-zinc-900/80 text-zinc-400 border-white/5 hover:border-white/20 hover:text-zinc-200 hover:bg-zinc-800'
                ]"
              >
                {{ category }}
              </button>
            </div>
          </div>
        </div>

        <!-- Grid de Figurinhas - Full width with auto-fill/auto-fit or many columns -->
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10 gap-4 sm:gap-6">
          <StickerCard 
            v-for="sticker in filteredStickers"
            :key="sticker.code"
            :sticker="sticker"
            :count="getCount(sticker.code)"
            @update="increment => handleUpdateSticker(sticker.code, increment)"
          />
        </div>

        <!-- Empty State -->
        <div v-if="filteredStickers.length === 0" class="text-center py-20">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-zinc-800/50 text-zinc-400 mb-4">
            <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-zinc-300">Nenhuma figurinha encontrada</h3>
          <p class="text-sm text-zinc-500 mt-1">Tente selecionar outra categoria.</p>
        </div>
      </div>
    </main>
  </div>
</template>
