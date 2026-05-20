import { ref } from 'vue'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'

export function useCollections() {
  const { user } = useAuth()
  const collections = ref([])
  const loading = ref(false)

  const fetchCollections = async () => {
    if (!user.value) return

    loading.value = true
    // Fetch collections where user is a member
    const { data, error } = await supabase
      .from('collection_members')
      .select('collections(*)')
      .eq('user_id', user.value.id)

    if (error) {
      console.error('Error fetching collections:', error)
    } else {
      // data is an array of { collections: { id, name, ... } }
      collections.value = data.map(item => item.collections).filter(Boolean)
    }
    loading.value = false
  }

  const generateInviteCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase()
  }

  const createCollection = async (name) => {
    if (!user.value) return null

    const inviteCode = generateInviteCode()

    // 1. Create collection
    const { data: newCollection, error: createError } = await supabase
      .from('collections')
      .insert({ name, invite_code: inviteCode })
      .select()
      .single()

    if (createError) {
      console.error('Error creating collection:', createError)
      return { error: createError.message }
    }

    // 2. Add creator as member
    const { error: memberError } = await supabase
      .from('collection_members')
      .insert({
        collection_id: newCollection.id,
        user_id: user.value.id
      })

    if (memberError) {
      console.error('Error adding member:', memberError)
      return { error: memberError.message }
    }

    await fetchCollections()
    return { data: newCollection }
  }

  const joinCollection = async (inviteCode) => {
    if (!user.value) return null

    // 1. Find collection by code
    const { data: collection, error: findError } = await supabase
      .from('collections')
      .select('*')
      .eq('invite_code', inviteCode.toUpperCase())
      .single()

    if (findError || !collection) {
      return { error: 'Código inválido ou coleção não encontrada.' }
    }

    // 2. Check if already member
    const { data: existingMember } = await supabase
      .from('collection_members')
      .select('*')
      .eq('collection_id', collection.id)
      .eq('user_id', user.value.id)
      .single()

    if (existingMember) {
      return { error: 'Você já faz parte desta coleção.' }
    }

    // 3. Join collection
    const { error: joinError } = await supabase
      .from('collection_members')
      .insert({
        collection_id: collection.id,
        user_id: user.value.id
      })

    if (joinError) {
      return { error: 'Erro ao entrar na coleção.' }
    }

    await fetchCollections()
    return { data: collection }
  }

  return {
    collections,
    loading,
    fetchCollections,
    createCollection,
    joinCollection
  }
}
