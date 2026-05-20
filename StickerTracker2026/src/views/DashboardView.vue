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
  <div class="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-green-500/30">
    <Navbar />

    <!-- Remove max-w-7xl mx-auto, set to full width with padding -->
    <main class="w-full px-6 py-10">
      
      <div v-if="loading && collections.length === 0" class="flex justify-center items-center py-20">
        <svg class="w-8 h-8 animate-spin text-green-500" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>

      <div v-else>
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-2xl font-bold text-white">Meus Álbuns</h2>
          
          <div class="flex gap-3" v-if="collections.length > 0">
            <button 
              @click="openModal('join')"
              class="px-4 py-2 rounded-xl text-sm font-medium bg-zinc-900 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors border border-white/5"
            >
              Entrar com Código
            </button>
            <button 
              @click="openModal('create')"
              class="px-4 py-2 rounded-xl text-sm font-medium bg-green-600 hover:bg-green-500 text-white transition-colors shadow-lg shadow-green-500/20"
            >
              Novo Álbum
            </button>
          </div>
        </div>

        <!-- Grid de Coleções - Added more cols for ultra-wide -->
        <div v-if="collections.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          <CollectionCard 
            v-for="collection in collections" 
            :key="collection.id"
            :collection="collection"
          />
        </div>

        <!-- Empty State -->
        <div v-else class="py-20 bg-zinc-900/50 rounded-3xl border border-white/5 flex flex-col items-center justify-center text-center">
          <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-zinc-800 text-zinc-400 mb-6">
            <svg class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-white mb-2">Nenhum álbum encontrado</h3>
          <p class="text-zinc-400 max-w-md text-center mb-8">
            Você ainda não possui nenhum álbum de figurinhas. Crie um novo álbum ou entre em um existente usando um código de convite.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md">
            <button 
              @click="openModal('create')"
              class="px-6 py-3 rounded-xl font-medium bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 text-white transition-all shadow-lg shadow-green-500/25 flex items-center justify-center gap-2"
            >
              Criar Novo Álbum
            </button>
            <button 
              @click="openModal('join')"
              class="px-6 py-3 rounded-xl font-medium bg-zinc-800 text-white hover:bg-zinc-700 transition-colors border border-white/10 flex items-center justify-center"
            >
              Entrar com Código
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