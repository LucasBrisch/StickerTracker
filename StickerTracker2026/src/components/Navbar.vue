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
  <header class="border-b border-white/10 bg-zinc-900/80 backdrop-blur-md sticky top-0 z-50">
    <div class="w-full px-6 h-20 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <router-link to="/dashboard" class="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center shadow-lg shadow-green-500/20">
            <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div>
            <h1 class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-yellow-400">
              Album do hexa 2026
            </h1>
          </div>
        </router-link>
      </div>

      <div class="flex items-center gap-4" v-if="user">
        <span class="text-sm text-zinc-400 hidden sm:block">{{ user.email }}</span>
        <button
          @click="handleLogout"
          class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
        >
          <span>Sair</span>
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    </div>
  </header>
</template>
