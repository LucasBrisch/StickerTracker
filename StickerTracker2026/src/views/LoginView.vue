<script setup>
import { useAuth } from '../composables/useAuth'

const { loginWithGoogle } = useAuth()
</script>

<template>
  <div class="min-h-screen bg-[#00e5ff] text-black flex items-center justify-center p-6 font-sans relative overflow-hidden">
    
    <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dots-3.png')] opacity-20 pointer-events-none"></div>
    <div class="absolute top-10 left-10 text-[25vw] font-black opacity-10 leading-none -rotate-12 pointer-events-none text-black">2026</div>
    <div class="absolute bottom-10 right-10 text-[20vw] font-black opacity-10 leading-none rotate-6 pointer-events-none text-black">HEXA</div>

    <div class="w-full max-w-lg relative z-10">
      
      <!-- Login Card -->
      <div class="bg-white border-8 border-black p-10 shadow-[24px_24px_0px_#000] transform -rotate-1">
        
        <div class="w-28 h-28 bg-[#ffcf00] border-8 border-black shadow-[8px_8px_0px_#000] flex items-center justify-center mb-10 transform -rotate-6 mx-auto animate-bounce" style="animation-duration: 3s;">
          <svg class="w-14 h-14 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="square" stroke-linejoin="miter" stroke-width="3" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>

        <h1 class="text-6xl font-black mb-6 text-center tracking-tighter uppercase leading-none">
          Hexa <br><span class="text-[#ff003c] bg-black px-4 mt-2 inline-block">2026</span>
        </h1>
        <p class="text-black font-black text-center text-xl mb-12 uppercase border-y-8 border-black py-6 bg-[#ffcf00]">
          A febre das figurinhas voltou.<br>Colecione. Troque. Domine.
        </p>

        <button
          @click="loginWithGoogle"
          class="w-full bg-[#ff003c] text-white py-5 px-6 font-black uppercase text-2xl border-8 border-black shadow-[12px_12px_0px_#000] hover:translate-y-[4px] hover:translate-x-[4px] hover:shadow-[8px_8px_0px_#000] active:translate-y-[12px] active:translate-x-[12px] active:shadow-none transition-all flex items-center justify-center gap-4 group"
        >
          <span class="bg-white text-black px-2 py-1 transform -rotate-6 group-hover:rotate-6 transition-transform">G</span>
          Entrar pra jogar
        </button>
      </div>

    </div>
  </div>
</template>