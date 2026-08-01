// app/actions/songs.ts
'use server'

import { createClient } from '@/app/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Song, SongWithRelations } from '@/app/type/song'

type SongInput = {
  title: string
  language: string
  album_id: number
  has_mv: boolean
  release_date: string
  starter_id: number | null
  artist_id: number
}

// ---------- CREATE ----------
export async function createSong(input: SongInput) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('songs')
    .insert(input)
    .select()
    .single()

  if (error) return { success: false, error: error.message }

  revalidatePath('/')
  return { success: true, song: data as Song }
}

// ---------- READ (list with relations) ----------
export async function getSongs() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('songs')
    .select(`
      *,
      album:album_id ( * ),
      artist:artist_id ( * ),
      starter:starter_id ( * )
    `)
    .order('release_date', { ascending: false })

  if (error) return { success: false, error: error.message, songs: [] as SongWithRelations[] }

  return { success: true, songs: data as unknown as SongWithRelations[] }
}

// ---------- READ (single, with relations) ----------
export async function getSong(id: number) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('songs')
    .select(`
      *,
      album:album_id ( * ),
      artist:artist_id ( * ),
      starter:starter_id ( * )
    `)
    .eq('id', id)
    .single()

  if (error) return { success: false, error: error.message, song: null }

  return { success: true, song: data as unknown as SongWithRelations }
}

// ---------- UPDATE ----------
export async function updateSong(id: number, input: Partial<SongInput>) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('songs')
    .update(input)
    .eq('id', id)
    .select()
    .single()

  if (error) return { success: false, error: error.message }

  revalidatePath('/')
  return { success: true, song: data as Song }
}

// ---------- DELETE ----------
export async function deleteSong(id: number) {
  const supabase = await createClient()

  const { error } = await supabase.from('songs').delete().eq('id', id)

  if (error) return { success: false, error: error.message }

  revalidatePath('/')
  return { success: true }
}