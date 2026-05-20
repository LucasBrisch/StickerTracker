<script setup>
import { onMounted, ref, computed } from 'vue'

const categories = computed(() => {
  const unique = new Set(
    stickers.value.map(s => s.category)
  )

  return ['ALL', ...unique]
})

onMounted(async () => {
  const {
    data: { user: currentUser }
  } = await supabase.auth.getUser()

  user.value = currentUser

  const { data } = await supabase
    .from('stickers')
    .select('*')
    .order('category')

  stickers.value = data || []
})
</script>

<template>
  <div class="min-h-screen bg-zinc-950 text-white p-6">

    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold">
          Sticker Tracker
        </h1>

        <p class="text-zinc-400 mt-1">
          {{ user?.email }}
        </p>
      </div>
    </div>

    <div class="flex gap-2 flex-wrap mb-8">
      <button
        v-for="category in categories"
        :key="category"
        @click="selectedCategory = category"
        class="px-4 py-2 rounded-xl border border-zinc-700 hover:bg-zinc-800 transition"
      >
        {{ category }}
      </button>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      <div
        v-for="sticker in filteredStickers"
        :key="sticker.code"
        class="bg-zinc-900 border rounded-2xl p-4"
        :class="[
          sticker.shiny
            ? 'border-yellow-500'
            : 'border-zinc-800'
        ]"
      >
        <div class="flex items-center justify-between mb-4">
          <span class="font-bold text-lg">
            {{ sticker.code }}
          </span>

          <span v-if="sticker.shiny">
            ✨
          </span>
        </div>

        <div class="text-sm text-zinc-400 mb-3">
          {{ sticker.category }}
        </div>

        <div
          v-if="sticker.is_squad"
          class="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-lg inline-block"
        >
          Squad
        </div>
      </div>
    </div>
  </div>
</template>