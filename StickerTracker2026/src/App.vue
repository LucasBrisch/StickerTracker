<script setup>
import { onMounted } from 'vue'
import { supabase } from './lib/supabase'

onMounted(async () => {
  const { data, error } = await supabase
    .from('stickers')
    .select('*')

  console.log(data)
  console.log(error)
})
</script>

<template>
  <div>
    teste
  </div>
</template>