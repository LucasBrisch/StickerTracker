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
    class="bg-white border-8 border-black p-6 cursor-pointer shadow-[12px_12px_0px_#000] hover:-translate-y-2 hover:-translate-x-2 hover:shadow-[20px_20px_0px_#ff003c] transition-all duration-200 flex flex-col justify-between min-h-[260px] relative overflow-hidden"
  >
    <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>

    <div class="flex justify-between items-start mb-6 relative z-10">
      <div class="w-20 h-20 bg-[#00e5ff] border-4 border-black shadow-[6px_6px_0px_#000] flex items-center justify-center transform -rotate-6 hover:rotate-12 transition-transform">
        <svg class="w-10 h-10 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="square" stroke-linejoin="miter" stroke-width="3" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      </div>
      
      <div 
        @click.stop="copyCode"
        class="bg-[#ffcf00] border-4 border-black px-4 py-2 font-black uppercase text-sm cursor-pointer shadow-[6px_6px_0px_#000] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[4px_4px_0px_#000] active:translate-y-[6px] active:translate-x-[6px] active:shadow-none transition-all flex items-center gap-2"
        :title="copied ? 'Copiado!' : 'Copiar código'"
      >
        <span>{{ copied ? 'COPIADO' : collection.invite_code }}</span>
      </div>
    </div>
    
    <div class="relative z-10 mt-auto">
      <h3 class="text-3xl font-black text-black uppercase leading-none mb-4 break-words">
        {{ collection.name }}
      </h3>
      <div class="inline-block bg-black text-white px-3 py-2 text-sm font-black uppercase shadow-[4px_4px_0px_#ff003c]">
        {{ new Date(collection.created_at).toLocaleDateString() }}
      </div>
    </div>
  </div>
</template>
