<script setup>
defineProps({
  sticker: {
    type: Object,
    required: true
  },
  count: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['update'])

const handleIncrement = () => emit('update', 1)
const handleDecrement = () => emit('update', -1)
</script>

<template>
  <div
    class="relative group bg-white border-4 border-black p-1.5 transition-all duration-150 transform-gpu"
    :class="[
      count > 0 
        ? 'shadow-[6px_6px_0px_#000] hover:-translate-y-2 hover:-translate-x-1 hover:shadow-[10px_10px_0px_#ff003c]' 
        : 'opacity-50 border-dashed border-gray-400 bg-gray-100 hover:opacity-100 hover:border-solid hover:border-black shadow-none hover:shadow-[6px_6px_0px_#000]'
    ]"
  >
    <div class="h-full bg-white border-4 border-black relative overflow-hidden flex flex-col justify-between"
         :class="count > 0 ? (sticker.shiny ? 'bg-[#ffcf00]' : 'bg-[#00e5ff]') : 'bg-gray-100'">
      
      <!-- Inside padding -->
      <div class="p-3 flex flex-col h-full z-10 relative">
        <div class="flex items-start justify-between mb-4 gap-1">
          <span class="text-2xl sm:text-3xl font-black tracking-tighter uppercase text-black break-all"
                :class="sticker.shiny ? 'text-black drop-shadow-[2px_2px_0px_#fff]' : ''">
            {{ sticker.code }}
          </span>

          <div v-if="sticker.shiny && count > 0" class="text-2xl animate-spin shrink-0" style="animation-duration: 4s;">⭐</div>
        </div>

        <div class="mb-6">
          <div class="text-xs sm:text-sm font-black tracking-widest uppercase mb-1 text-black bg-white inline-block px-2 py-0.5 border-2 border-black shadow-[2px_2px_0px_#000]">
            {{ sticker.category }}
          </div>
          <div class="mt-2" v-if="sticker.is_squad">
            <span class="inline-block px-2 py-1 text-[10px] sm:text-xs font-black uppercase tracking-widest bg-black text-white border-2 border-black shadow-[2px_2px_0px_#ff003c]">
              SQUAD
            </span>
          </div>
        </div>

        <!-- Controles de Quantidade -->
        <div class="flex items-center justify-between bg-white border-4 border-black p-1.5 mt-auto shadow-[4px_4px_0px_#000]">
          <button 
            @click="handleDecrement"
            :disabled="count === 0"
            class="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-white border-2 border-black hover:bg-black hover:text-white disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-black transition-all font-black text-2xl"
          >
            -
          </button>

          <div class="flex flex-col items-center justify-center px-2">
            <span class="text-2xl sm:text-3xl font-black text-black leading-none">
              {{ count }}
            </span>
          </div>

          <button 
            @click="handleIncrement"
            class="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-[#ffcf00] border-2 border-black hover:bg-black hover:text-white transition-all font-black text-2xl"
          >
            +
          </button>
        </div>
      </div>
      
      <div v-if="sticker.shiny && count > 0" class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-40 pointer-events-none mix-blend-overlay"></div>
    </div>
  </div>
</template>
