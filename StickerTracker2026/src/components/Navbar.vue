<script setup>
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const { logout, user } = useAuth()
const router = useRouter()

const handleLogout = async () => {
  await logout()
  router.push('/')
}
</script>

<template>
  <header class="bg-[#ffcf00] border-b-8 border-black sticky top-0 z-50 overflow-hidden">
    <!-- Diagonal background pattern -->
    <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')] opacity-10 pointer-events-none"></div>

    <div class="w-full px-4 sm:px-8 h-24 flex items-center justify-between max-w-[1800px] mx-auto relative z-10">
      <div class="flex items-center gap-3">
        <router-link to="/dashboard" class="flex items-center gap-4 hover:-translate-y-1 hover:rotate-2 transition-transform">
          <div class="w-14 h-14 bg-[#00e5ff] border-4 border-black shadow-[4px_4px_0px_#000] flex items-center justify-center transform -rotate-6">
            <svg class="w-8 h-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="square" stroke-linejoin="miter" stroke-width="3" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div>
            <h1 class="text-4xl font-black uppercase tracking-tighter text-black bg-white px-2 border-4 border-black shadow-[4px_4px_0px_#000]">
              Hexa<span class="text-[#ff003c]">2026</span>
            </h1>
          </div>
        </router-link>
      </div>

      <div class="flex items-center gap-6" v-if="user">
        <div class="hidden sm:block">
          <span class="px-4 py-2 bg-white border-4 border-black font-black text-sm uppercase shadow-[4px_4px_0px_#000]">
            {{ user.email.split('@')[0] }}
          </span>
        </div>
        <button
          @click="handleLogout"
          class="flex items-center justify-center w-14 h-14 bg-[#ff003c] border-4 border-black shadow-[4px_4px_0px_#000] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_#000] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none text-white transition-all"
          title="Sair"
        >
          <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="square" stroke-linejoin="miter" stroke-width="3" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    </div>
  </header>
</template>
