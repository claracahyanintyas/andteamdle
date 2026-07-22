'use client'

import { useState, FormEvent } from 'react'
import type { Album } from '@/app/type/album'
import { createAlbum, updateAlbum } from '@/app/actions/albums'
import { createClient } from '@/app/utils/supabase/client'

interface AlbumFormProps {
  album?: Album // pass this in when editing, omit when creating
  onSuccess?: () => void
}

export default function AlbumForm({ album, onSuccess }: AlbumFormProps) {
  const [title, setTitle] = useState(album?.title ?? '')
  const [releaseDate, setReleaseDate] = useState(album?.release_date ?? '')
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    let coverUrl = album?.cover_url ?? null

    if (coverFile) {
      const supabase = createClient()
      const filePath = `${crypto.randomUUID()}-${coverFile.name}`

      const { error: uploadError } = await supabase.storage
        .from('covers')
        .upload(filePath, coverFile)

      if (uploadError) {
        setError(`Cover upload failed: ${uploadError.message}`)
        setIsSubmitting(false)
        return
      }

      const { data: publicUrlData } = supabase.storage
        .from('covers')
        .getPublicUrl(filePath)

      coverUrl = publicUrlData.publicUrl
    }

    const result = album
      ? await updateAlbum(album.id, { title: title, release_date: releaseDate, cover_url: coverUrl })
      : await createAlbum({ title: title, release_date: releaseDate, cover_url: coverUrl })

    setIsSubmitting(false)

    if (!result.success) {
      setError(result.error ?? 'Something went wrong')
      return
    }

    onSuccess?.()
  }

  return (
    <div className='bg-secondary text-center rounded-lg'>
    <form onSubmit={handleSubmit} className='flex flex-col p-2'>
      <label htmlFor="title">Album title</label>
      <input
        type="text"
        id="title"
        name="title"
        value={title}
        className='bg-accent rounded-sm text-primary p-1'
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <label htmlFor="release-date">Release date</label>
      <input
        type="date"
        id="release-date"
        name="release-date"
        value={releaseDate}
        className='w-full bg-accent bg-accent rounded-sm text-primary p-1'
        onChange={(e) => setReleaseDate(e.target.value)}
        required
      />

      <label htmlFor="album-cover">Album cover</label>
      <input
        type="file"
        id="album-cover"
        name="album-cover"
        accept="image/*"
        className='bg-accent bg-accent rounded-sm text-primary p-1'
        onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)}
      />

      {error && <p className='text-red'>{error}</p>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : album ? 'Update album' : 'Add album'}
      </button>
    </form>
    </div>
  )
}