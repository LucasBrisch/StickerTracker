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

const handleIncrement = () => {
  emit('update', 1)
}

const handleDecrement = () => {
  emit('update', -1)
}
</script>

<template>
  <div
    class="relative group rounded-2xl p-[1px] transition-all duration-300"
    :class="[
      sticker.shiny
        ? 'bg-gradient-to-br from-yellow-300 via-yellow-400 to-green-500 shadow-lg shadow-yellow-500/10'
        : 'bg-white/10'
    ]"
  >
    <div class="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-20 transition-opacity rounded-2xl"
         :class="sticker.shiny ? 'from-white to-transparent' : ''"></div>
    
    <div class="h-full bg-zinc-900 rounded-[15px] p-4 relative overflow-hidden flex flex-col justify-between"
         :class="count > 0 ? 'border border-green-500/30' : 'border border-transparent'">
      
      <div v-if="sticker.shiny" class="absolute -inset-full top-0 z-0 block h-full w-1/2 -skew-x-12 transform bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:animate-shine"></div>

      <div class="relative z-10 flex items-start justify-between mb-4">
        <span class="text-xl font-black tracking-tight"
              :class="sticker.shiny ? 'text-transparent bg-clip-text bg-gradient-to-br from-yellow-200 to-yellow-500 drop-shadow-sm' : 'text-zinc-200'">
          {{ sticker.code }}
        </span>

        <span v-if="sticker.shiny" class="text-xl animate-pulse">✨</span>
      </div>

      <div class="relative z-10 mb-4">
        <div class="text-[10px] font-bold tracking-wider uppercase text-zinc-500 mb-1">
          {{ sticker.category }}
        </div>

        <div class="min-h-[24px]">
          <span
            v-if="sticker.is_squad"
            class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20"
          >
            Squad
          </span>
        </div>
      </div>

      <!-- Controles de Quantidade -->
      <div class="relative z-10 flex items-center justify-between bg-zinc-950 rounded-xl p-1.5 border border-white/5">
        <button 
          @click="handleDecrement"
          :disabled="count === 0"
          class="w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
          </svg>
        </button>

        <span class="font-mono font-bold w-8 text-center" :class="count > 0 ? 'text-green-400' : 'text-zinc-500'">
          {{ count }}
        </span>

        <button 
          @click="handleIncrement"
          class="w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes shine {
  100% {
    left: 125%;
  }
}

.animate-shine {
  animation: shine 1.5s ease-in-out infinite;
}
</style>
