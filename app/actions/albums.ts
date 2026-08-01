// app/actions/albums.ts
'use server'

import { createClient } from '@/app/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { Album } from '@/app/type/album'


type AlbumInput = {
  title: string
  release_date: string
  cover_url?: string | null
}

// ---------- CREATE ----------
export async function createAlbum(input: AlbumInput) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('albums')
    .insert({
      title: input.title,
      release_date: input.release_date,
      cover_url: input.cover_url ?? null,
    })
    .select()
    .single()

  if (error) return { success: false, error: error.message }

  revalidatePath('/')
  return { success: true, album: data as Album }
}

// ---------- READ (list) ----------
export async function getAlbums() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('albums')
    .select('*')
    .order('release_date', { ascending: false })

  if (error) return { success: false, error: error.message, albums: [] as Album[] }

  return { success: true, albums: data as Album[] }
}

// ---------- READ (single) ----------
export async function getAlbum(id: number) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('albums')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return { success: false, error: error.message, album: null }

  return { success: true, album: data as Album }
}

// ---------- UPDATE ----------
export async function updateAlbum(id: number, input: Partial<AlbumInput>) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('albums')
    .update(input)
    .eq('id', id)
    .select()
    .single()

  if (error) return { success: false, error: error.message }

  revalidatePath('/')
  return { success: true, album: data as Album }
}

// ---------- DELETE ----------
export async function deleteAlbum(id: number) {
  const supabase = await createClient()

  const { data: album } = await supabase
    .from('albums')
    .select('cover_url')
    .eq('id', id)
    .single()

  const { error } = await supabase.from('albums').delete().eq('id', id)

  if (error) return { success: false, error: error.message }

  if (album?.cover_url) {
    const path = album.cover_url.split('/album-covers/')[1]
    if (path) {
      await supabase.storage.from('album-covers').remove([path])
    }
  }

  revalidatePath('/')
  return { success: true }
}