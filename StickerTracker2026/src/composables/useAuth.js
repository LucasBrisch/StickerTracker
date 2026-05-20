import { ref } from 'vue'
import { supabase } from '../lib/supabase'

const user = ref(null)
const loading = ref(true)

export function useAuth() {
  const initAuth = async () => {
    loading.value = true
    const { data } = await supabase.auth.getUser()
    user.value = data?.user || null
    
    supabase.auth.onAuthStateChange((event, session) => {
      user.value = session?.user || null
    })
    
    loading.value = false
  }

  const loginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/dashboard'
      }
    })
  }

  const logout = async () => {
    await supabase.auth.signOut()
  }

  return {
    user,
    loading,
    initAuth,
    loginWithGoogle,
    logout
  }
}
