import { createClient } from '@supabase/supabase-js'
import { mockSupabase } from './mockSupabase'

const useMock = import.meta.env.VITE_USE_MOCK_DATA === 'true'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = useMock
  ? mockSupabase
  : createClient(
      supabaseUrl,
      supabaseKey
    )