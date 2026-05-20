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
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
    <div class="bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
      <button @click="handleClose" class="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors">
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <h2 class="text-xl font-bold text-slate-200 mb-2">
        {{ mode === 'create' ? 'Criar Novo Álbum' : 'Entrar em um Álbum' }}
      </h2>
      <p class="text-sm text-slate-400 mb-6">
        {{ mode === 'create' 
          ? 'Dê um nome para a sua coleção e convide amigos depois.' 
          : 'Insira o código de 6 dígitos que você recebeu.' }}
      </p>

      <form @submit.prevent="handleSubmit">
        <div class="mb-4">
          <label class="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">
            {{ mode === 'create' ? 'Nome do Álbum' : 'Código de Convite' }}
          </label>
          <input 
            v-model="inputValue"
            type="text" 
            :placeholder="mode === 'create' ? 'Ex: Álbum da Firma' : 'Ex: A1B2C3'"
            :class="[
              'w-full bg-slate-950 border rounded-xl px-4 py-3 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 transition-all',
              error ? 'border-red-500 focus:ring-red-500/50' : 'border-white/10 focus:border-fuchsia-500 focus:ring-fuchsia-500/50'
            ]"
            required
            :maxlength="mode === 'create' ? 50 : 6"
            :uppercase="mode === 'join'"
          />
          <p v-if="error" class="mt-2 text-sm text-red-400">{{ error }}</p>
        </div>

        <div class="flex gap-3 mt-6">
          <button 
            type="button"
            @click="handleClose"
            class="flex-1 px-4 py-3 rounded-xl font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
          >
            Cancelar
          </button>
          <button 
            type="submit"
            :disabled="loading || !inputValue.trim()"
            class="flex-1 px-4 py-3 rounded-xl font-medium text-white bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2"
          >
            <svg v-if="loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ mode === 'create' ? 'Criar Álbum' : 'Entrar' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
