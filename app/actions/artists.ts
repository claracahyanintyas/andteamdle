'use server'

import { createClient } from '@/app/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Artist, ArtistWithGroup } from '@/app/type/artist'

type ArtistInput = {
  name: string
  group_id: number | null
  picture_url: string | null
}

const SELECT_WITH_GROUP = '*, group:group_id(*)'

// ---------- CREATE ----------
export async function createArtist(input: ArtistInput) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('artists')
    .insert({
      name: input.name,
      group_id: input.group_id,
      picture_url: input.picture_url ?? null,
    })
    .select(SELECT_WITH_GROUP)
    .single()

  if (error) return { success: false, error: error.message }

  revalidatePath('/')
  return { success: true, artist: data as ArtistWithGroup }
}

// ---------- READ (list) ----------
export async function getArtists() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('artists')
    .select(SELECT_WITH_GROUP)
    .order('name', { ascending: true })

  if (error) return { success: false, error: error.message, artists: [] as ArtistWithGroup[] }

  return { success: true, artists: data as ArtistWithGroup[] }
}

// ---------- READ (single) ----------
export async function getArtist(id: number) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('artists')
    .select(SELECT_WITH_GROUP)
    .eq('id', id)
    .single()

  if (error) return { success: false, error: error.message, artist: null }

  return { success: true, artist: data as ArtistWithGroup }
}

// ---------- UPDATE ----------
export async function updateArtist(id: number, input: Partial<ArtistInput>) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('artists')
    .update(input)
    .eq('id', id)
    .select(SELECT_WITH_GROUP)
    .single()

  if (error) return { success: false, error: error.message }

  revalidatePath('/')
  return { success: true, artist: data as ArtistWithGroup }
}

// ---------- DELETE ----------
export async function deleteArtist(id: number) {
  const supabase = await createClient()

  const { error } = await supabase.from('artists').delete().eq('id', id)

  if (error) return { success: false, error: error.message }

  revalidatePath('/')
  return { success: true }
}