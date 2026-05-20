<script setup>
import { useAuth } from '../composables/useAuth'

const { loginWithGoogle } = useAuth()
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-white flex items-center justify-center relative overflow-hidden">
    <!-- Efeitos de Background -->
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-fuchsia-600/20 rounded-full blur-[120px] pointer-events-none"></div>
    <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none"></div>

    <div class="bg-slate-900/80 backdrop-blur-xl p-10 rounded-3xl border border-white/10 w-full max-w-md relative z-10 shadow-2xl">
      <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-fuchsia-500/20 mb-8 mx-auto">
        <svg class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      </div>

      <h1 class="text-3xl font-black mb-2 text-center text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-indigo-400">
        Sticker Tracker
      </h1>

      <p class="text-slate-400 mb-10 text-center">
        O jeito mais fácil de gerenciar suas figurinhas da Copa do Mundo com seus amigos.
      </p>

      <button
        @click="loginWithGoogle"
        class="w-full bg-white text-black py-3.5 px-4 rounded-xl font-bold hover:bg-slate-100 transition-all flex items-center justify-center gap-3 shadow-xl shadow-white/5 group"
      >
        <svg class="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        Continuar com Google
      </button>
    </div>
  </div>
</template>