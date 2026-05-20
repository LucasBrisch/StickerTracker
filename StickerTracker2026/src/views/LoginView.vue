<script setup>
import { supabase } from '../lib/supabase'

const loginWithGoogle = async () => {
  await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: 'http://localhost:5173/dashboard'
    }
  })
}
</script>

<template>
  <div class="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
    <div class="bg-zinc-900 p-10 rounded-2xl border border-zinc-800 w-full max-w-md">
      <h1 class="text-3xl font-bold mb-2">
        Sticker Tracker
      </h1>

      <p class="text-zinc-400 mb-8">
        Trackeie suas figurinhas da Copa.
      </p>

      <button
        @click="loginWithGoogle"
        class="w-full bg-white text-black py-3 rounded-xl font-semibold hover:opacity-90 transition"
      >
        Entrar com Google
      </button>
    </div>
  </div>
</template>