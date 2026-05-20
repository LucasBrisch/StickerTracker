<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '../components/Navbar.vue'
import CollectionCard from '../components/CollectionCard.vue'
import ModalCreateJoin from '../components/ModalCreateJoin.vue'
import { useCollections } from '../composables/useCollections'
import { useAuth } from '../composables/useAuth'

const { collections, loading, fetchCollections, createCollection, joinCollection } = useCollections()
const { user, initAuth } = useAuth()
const router = useRouter()

const showModal = ref(false)
const modalMode = ref('create') // 'create' or 'join'
const modalLoading = ref(false)
const modalError = ref('')

onMounted(async () => {
  await initAuth()
  if (user.value) {
    await fetchCollections()
  }
})

const openModal = (mode) => {
  modalMode.value = mode
  modalError.value = ''
  showModal.value = true
}

const handleModalSubmit = async ({ mode, value }) => {
  modalLoading.value = true
  modalError.value = ''

  let result
  if (mode === 'create') {
    result = await createCollection(value)
  } else {
    result = await joinCollection(value)
  }

  modalLoading.value = false

  if (result?.error) {
    modalError.value = result.error
  } else if (result?.data) {
    showModal.value = false
    router.push(`/collection/${result.data.id}`)
  }
}
</script>

<template>
  <div class="min-h-screen bg-[#f4f4f0] text-black font-sans selection:bg-[#ff003c]/30">
    <Navbar />

    <main class="w-full px-4 sm:px-8 py-12 max-w-[1800px] mx-auto">
      
      <div v-if="loading && collections.length === 0" class="flex justify-center items-center py-32">
        <div class="w-24 h-24 bg-[#00e5ff] border-8 border-black shadow-[12px_12px_0px_#000] flex items-center justify-center animate-spin">
          <div class="w-12 h-12 bg-black"></div>
        </div>
      </div>

      <div v-else>
        <div class="flex flex-col xl:flex-row items-start xl:items-end justify-between mb-16 gap-8 border-b-8 border-black pb-8">
          <div>
            <h2 class="text-7xl md:text-[6rem] font-black text-black uppercase tracking-tighter leading-[0.8] mb-4">
              Meus<br><span class="text-[#ff003c] bg-black px-2 mt-2 inline-block">Álbuns</span>
            </h2>
          </div>
          
          <div class="flex flex-col sm:flex-row gap-6 w-full xl:w-auto">
            <button 
              @click="openModal('join')"
              class="px-10 py-5 text-xl font-black uppercase bg-white border-8 border-black shadow-[8px_8px_0px_#000] hover:translate-y-[4px] hover:translate-x-[4px] hover:shadow-[4px_4px_0px_#000] active:translate-y-[8px] active:translate-x-[8px] active:shadow-none transition-all flex items-center justify-center"
            >
              Entrar com Código
            </button>
            <button 
              @click="openModal('create')"
              class="px-10 py-5 text-xl font-black uppercase bg-[#00e5ff] border-8 border-black shadow-[8px_8px_0px_#000] hover:translate-y-[4px] hover:translate-x-[4px] hover:shadow-[4px_4px_0px_#000] active:translate-y-[8px] active:translate-x-[8px] active:shadow-none transition-all flex items-center justify-center"
            >
              + Novo Álbum
            </button>
          </div>
        </div>

        <div v-if="collections.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
          <CollectionCard 
            v-for="collection in collections" 
            :key="collection.id"
            :collection="collection"
          />
        </div>

        <!-- Empty State -->
        <div v-else class="py-32 bg-white border-8 border-black flex flex-col items-center justify-center text-center shadow-[24px_24px_0px_#000] mt-12 relative overflow-hidden">
          <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')] opacity-10"></div>
          <div class="relative z-10 w-40 h-40 bg-[#ff003c] border-8 border-black shadow-[12px_12px_0px_#000] flex items-center justify-center transform rotate-12 mb-12 hover:-rotate-12 transition-transform duration-500">
            <svg class="w-20 h-20 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="square" stroke-linejoin="miter" stroke-width="3" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 class="text-5xl md:text-6xl font-black text-black uppercase mb-6 relative z-10 tracking-tighter">Nenhum álbum aqui!</h3>
          <p class="text-black font-black max-w-2xl text-center mb-12 text-2xl border-y-8 border-black py-6 bg-[#ffcf00] relative z-10 px-6">
            VOCÊ PRECISA CRIAR UM ÁLBUM OU ENTRAR EM UM EXISTENTE PARA COMEÇAR A COLECIONAR.
          </p>
          <div class="flex gap-6 relative z-10 flex-col sm:flex-row w-full max-w-2xl px-6">
            <button 
              @click="openModal('create')"
              class="w-full px-10 py-6 text-2xl font-black uppercase bg-[#00e5ff] border-8 border-black shadow-[12px_12px_0px_#000] hover:translate-y-[4px] hover:translate-x-[4px] hover:shadow-[8px_8px_0px_#000] active:translate-y-[12px] active:translate-x-[12px] active:shadow-none transition-all"
            >
              Criar Agora!
            </button>
          </div>
        </div>
      </div>
    </main>

    <ModalCreateJoin 
      :show="showModal"
      :mode="modalMode"
      :loading="modalLoading"
      :error="modalError"
      @close="showModal = false"
      @submit="handleModalSubmit"
    />
  </div>
</template>