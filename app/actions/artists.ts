// app/actions/artists.ts
'use server'

import { createClient } from '@/app/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Artist } from '@/app/type/artist'

type ArtistInput = {
  name: string
  type: string
  picture_url: string | null
}

// ---------- CREATE ----------
export async function createArtist(input: ArtistInput) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('artists')
    .insert({
      name: input.name,
      type: input.type,
      picture_url: input.picture_url ?? null,
    })
    .select()
    .single()

  if (error) return { success: false, error: error.message }

  revalidatePath('/')
  return { success: true, artist: data as Artist }
}

// ---------- READ (list) ----------
export async function getArtists() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('artists')
    .select('*')
    .order('name', { ascending: true })

  if (error) return { success: false, error: error.message, artists: [] as Artist[] }

  return { success: true, artists: data as Artist[] }
}

// ---------- READ (single) ----------
export async function getArtist(id: number) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('artists')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return { success: false, error: error.message, artist: null }

  return { success: true, artist: data as Artist }
}

// ---------- UPDATE ----------
export async function updateArtist(id: number, input: Partial<ArtistInput>) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('artists')
    .update(input)
    .eq('id', id)
    .select()
    .single()

  if (error) return { success: false, error: error.message }

  revalidatePath('/')
  return { success: true, artist: data as Artist }
}

// ---------- DELETE ----------
export async function deleteArtist(id: number) {
  const supabase = await createClient()

  const { error } = await supabase.from('artists').delete().eq('id', id)

  if (error) return { success: false, error: error.message }

  revalidatePath('/')
  return { success: true }
}