<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../lib/supabase'

const router = useRouter()
const user = ref(null)
const stickers = ref([])
const selectedCategory = ref('ALL')

const categories = computed(() => {
  const unique = new Set(
    stickers.value.map(s => s.category)
  )
  return ['ALL', ...unique]
})

const filteredStickers = computed(() => {
  if (selectedCategory.value === 'ALL') {
    return stickers.value
  }
  return stickers.value.filter(s => s.category === selectedCategory.value)
})

const handleLogout = async () => {
  await supabase.auth.signOut()
  router.push('/')
}

onMounted(async () => {
  const {
    data: { user: currentUser }
  } = await supabase.auth.getUser()

  user.value = currentUser

  const { data } = await supabase
    .from('stickers')
    .select('*')

  if (data) {
    data.sort((a, b) => {
      if (a.category !== b.category) {
        const weightA = a.category === 'FWC' ? -1 : (a.category === 'COKE' ? 1 : 0)
        const weightB = b.category === 'FWC' ? -1 : (b.category === 'COKE' ? 1 : 0)
        if (weightA !== weightB) return weightA - weightB
        return a.category.localeCompare(b.category)
      }
      return a.code.localeCompare(b.code, undefined, { numeric: true })
    })
  }

  stickers.value = data || []
})
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-fuchsia-500/30">
    <!-- Header -->
    <header class="border-b border-white/10 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-fuchsia-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-fuchsia-500/20">
            <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div>
            <h1 class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 to-indigo-400">
              Sticker Tracker
            </h1>
          </div>
        </div>

        <button
          @click="handleLogout"
          class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
        >
          <span>Sair</span>
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    </header>

    <main class="max-w-7xl mx-auto p-6 pt-10">
      <!-- Filtros -->
      <div class="mb-10">
        <h2 class="text-lg font-semibold text-slate-300 mb-4 flex items-center gap-2">
          <svg class="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filtrar por Categoria
        </h2>
        <div class="flex gap-3 overflow-x-auto pb-4 pt-1 snap-x scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <button
            v-for="category in categories"
            :key="category"
            @click="selectedCategory = category"
            class="snap-start shrink-0 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border backdrop-blur-sm"
            :class="[
              selectedCategory === category
                ? 'bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white border-transparent shadow-lg shadow-indigo-500/25 scale-105'
                : 'bg-slate-900/80 text-slate-400 border-white/5 hover:border-white/20 hover:text-slate-200 hover:bg-slate-800'
            ]"
          >
            {{ category }}
          </button>
        </div>
      </div>

      <!-- Grid de Figurinhas -->
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        <div
          v-for="sticker in filteredStickers"
          :key="sticker.code"
          class="relative group rounded-2xl p-[1px] transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
          :class="[
            sticker.shiny
              ? 'bg-gradient-to-br from-amber-200 via-yellow-400 to-orange-500 hover:shadow-amber-500/20'
              : 'bg-white/10 hover:bg-white/20 hover:shadow-white/5'
          ]"
        >
          <div class="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-20 transition-opacity rounded-2xl"
               :class="sticker.shiny ? 'from-white to-transparent' : ''"></div>
          
          <div class="h-full bg-slate-900 rounded-[15px] p-5 relative overflow-hidden flex flex-col justify-between">
            <!-- Reflexo brilhante para as Shiny -->
            <div v-if="sticker.shiny" class="absolute -inset-full top-0 z-0 block h-full w-1/2 -skew-x-12 transform bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:animate-shine"></div>

            <div class="relative z-10 flex items-start justify-between mb-8">
              <span class="text-2xl font-black tracking-tight"
                    :class="sticker.shiny ? 'text-transparent bg-clip-text bg-gradient-to-br from-yellow-200 to-amber-500 drop-shadow-sm' : 'text-slate-200'">
                {{ sticker.code }}
              </span>

              <span v-if="sticker.shiny" class="text-xl animate-pulse">
                ✨
              </span>
            </div>

            <div class="relative z-10">
              <div class="text-xs font-bold tracking-wider uppercase text-slate-500 mb-2">
                {{ sticker.category }}
              </div>

              <div class="min-h-[24px]">
                <span
                  v-if="sticker.is_squad"
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                >
                  <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Squad
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredStickers.length === 0" class="text-center py-20">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800/50 text-slate-400 mb-4">
          <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-slate-300">Nenhuma figurinha encontrada</h3>
        <p class="text-sm text-slate-500 mt-1">Tente selecionar outra categoria.</p>
      </div>
    </main>
  </div>
</template>

<style>
@keyframes shine {
  100% {
    left: 125%;
  }
}

.animate-shine {
  animation: shine 1.5s ease-in-out infinite;
}
</style>