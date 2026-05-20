import { supabase } from '../lib/supabase'
import { stickers } from './stickers'

const seed = async () => {
  const { data, error } = await supabase
    .from('stickers')
    .upsert(stickers, {
      onConflict: 'code',
    })

  console.log(data)
  console.log(error)
}

seed()