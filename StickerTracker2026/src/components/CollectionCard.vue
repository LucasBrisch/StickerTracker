<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  collection: {
    type: Object,
    required: true
  }
})

const router = useRouter()
const copied = ref(false)

const openCollection = () => {
  router.push(`/collection/${props.collection.id}`)
}

const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(props.collection.invite_code)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch (err) {
    console.error('Failed to copy text: ', err)
  }
}
</script>

<template>
  <div 
    @click="openCollection"
    class="bg-slate-900 border border-white/5 rounded-2xl p-6 cursor-pointer hover:border-fuchsia-500/50 hover:bg-slate-800 transition-all duration-300 group"
  >
    <div class="flex justify-between items-start mb-4">
      <div class="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors">
        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      </div>
      <div 
        @click.stop="copyCode"
        class="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-copy border border-white/5 hover:border-white/20"
        :title="copied ? 'Copiado!' : 'Copiar código de convite'"
      >
        <span class="text-xs font-mono font-medium transition-colors" :class="copied ? 'text-green-400' : 'text-slate-400'">
          Cód: {{ collection.invite_code }}
        </span>
        <svg v-if="copied" class="w-3.5 h-3.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <svg v-else class="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      </div>
    </div>
    
    <h3 class="text-lg font-semibold text-slate-200 mb-1 group-hover:text-fuchsia-400 transition-colors">
      {{ collection.name }}
    </h3>
    <p class="text-sm text-slate-500">
      Criado em {{ new Date(collection.created_at).toLocaleDateString() }}
    </p>
  </div>
</template>
