<script setup>
import { ref } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  mode: {
    type: String, // 'create' or 'join'
    default: 'create'
  },
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['close', 'submit'])

const inputValue = ref('')

const handleSubmit = () => {
  if (!inputValue.value.trim()) return
  emit('submit', { mode: props.mode, value: inputValue.value.trim() })
  inputValue.value = ''
}

const handleClose = () => {
  inputValue.value = ''
  emit('close')
}
</script>

<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
    <div class="bg-white border-8 border-black p-8 sm:p-10 w-full max-w-lg shadow-[20px_20px_0px_#ffcf00] relative">
      
      <button @click="handleClose" class="absolute -top-6 -right-6 w-14 h-14 bg-[#ff003c] border-4 border-black text-white hover:bg-black flex items-center justify-center transition-colors shadow-[6px_6px_0px_#000] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[4px_4px_0px_#000] active:translate-y-[6px] active:translate-x-[6px] active:shadow-none z-10">
        <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="square" stroke-linejoin="miter" stroke-width="3" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div class="w-20 h-20 bg-[#00e5ff] border-4 border-black shadow-[6px_6px_0px_#000] flex items-center justify-center mb-8 transform -rotate-6"
           :class="mode === 'create' ? 'bg-[#00e5ff]' : 'bg-[#ffcf00]'">
        <svg v-if="mode === 'create'" class="w-10 h-10 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="square" stroke-linejoin="miter" stroke-width="3" d="M12 4v16m8-8H4" />
        </svg>
        <svg v-else class="w-10 h-10 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="square" stroke-linejoin="miter" stroke-width="3" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      </div>

      <h2 class="text-4xl sm:text-5xl font-black text-black mb-4 uppercase tracking-tighter leading-none">
        {{ mode === 'create' ? 'CRIAR ÁLBUM' : 'ENTRAR NO ÁLBUM' }}
      </h2>
      <p class="text-lg text-black mb-10 font-bold border-l-8 border-[#ff003c] pl-4">
        {{ mode === 'create' 
          ? 'Dê um nome para a sua coleção e convide seus amigos depois.' 
          : 'Insira o código de 6 dígitos que você recebeu.' }}
      </p>

      <form @submit.prevent="handleSubmit" class="relative z-10">
        <div class="mb-10">
          <label class="block text-xl font-black text-black mb-4 uppercase">
            {{ mode === 'create' ? 'Nome do Álbum' : 'Código de Convite' }}
          </label>
          <input 
            v-model="inputValue"
            type="text" 
            :placeholder="mode === 'create' ? 'Ex: Álbum da Firma' : 'Ex: A1B2C3'"
            :class="[
              'w-full bg-[#f4f4f0] border-4 border-black px-6 py-5 text-2xl font-black text-black placeholder:text-gray-400 focus:outline-none focus:bg-white transition-all shadow-[inset_4px_4px_0px_#e5e5e5]',
              error ? 'border-red-500 bg-red-50' : 'focus:border-black'
            ]"
            required
            :maxlength="mode === 'create' ? 50 : 6"
            :uppercase="mode === 'join'"
          />
          <p v-if="error" class="mt-4 text-xl text-white bg-black border-4 border-black p-4 font-black uppercase flex items-center gap-3 transform rotate-1 shadow-[4px_4px_0px_#ff003c]">
            <svg class="w-6 h-6 text-[#ff003c]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="square" stroke-linejoin="miter" stroke-width="3" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{ error }}
          </p>
        </div>

        <div class="flex gap-4">
          <button 
            type="submit"
            :disabled="loading || !inputValue.trim()"
            class="w-full px-6 py-6 font-black uppercase text-3xl text-white bg-[#00e5ff] text-black border-4 border-black hover:bg-black hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[8px_8px_0px_#000] hover:translate-y-[4px] hover:translate-x-[4px] hover:shadow-[4px_4px_0px_#000] active:translate-y-[8px] active:translate-x-[8px] active:shadow-none flex items-center justify-center gap-4"
          >
            <svg v-if="loading" class="w-8 h-8 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ mode === 'create' ? 'CRIAR!' : 'ENTRAR!' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
