'use client'

import { useState, FormEvent } from 'react'
import type { Artist } from '@/app/type/artist'
import { createArtist, updateArtist } from '@/app/actions/artists'
import { createClient } from '@/app/utils/supabase/client'

interface ArtistFormProps {
  artist?: Artist
  onSuccess?: () => void
}

export default function ArtistForm({ artist, onSuccess }: ArtistFormProps) {
  const [name, setName] = useState(artist?.name ?? '')
  const [type, setType] = useState(artist?.type ?? '')
  const [pictureFile, setPictureFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    let pictureUrl = artist?.picture_url ?? null

    if (pictureFile) {
      const supabase = createClient()
      const filePath = `${crypto.randomUUID()}-${pictureFile.name}`

      const { error: uploadError } = await supabase.storage
        .from('picture')
        .upload(filePath, pictureFile)

      if (uploadError) {
        setError(`Picture upload failed: ${uploadError.message}`)
        setIsSubmitting(false)
        return
      }

      const { data: publicUrlData } = supabase.storage
        .from('picture')
        .getPublicUrl(filePath)

      pictureUrl = publicUrlData.publicUrl
    }

    const result = artist
      ? await updateArtist(artist.id, { name, type, picture_url: pictureUrl })
      : await createArtist({ name, type, picture_url: pictureUrl })

    setIsSubmitting(false)

    if (!result.success) {
      setError(result.error ?? 'Something went wrong')
      return
    }

    onSuccess?.()
  }

  return (
    <div className="bg-secondary text-center rounded-lg">
      <form onSubmit={handleSubmit} className="flex flex-col p-2 gap-2">
        <label htmlFor="name">Artist name</label>
        <input
          type="text"
          id="name"
          value={name}
          className="bg-accent rounded-sm text-primary p-1"
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label htmlFor="type">Type</label>
        <input
          type="text"
          id="type"
          value={type}
          className="bg-accent rounded-sm text-primary p-1"
          onChange={(e) => setType(e.target.value)}
          required
        />

        <label htmlFor="picture">Picture</label>
        <input
          type="file"
          id="picture"
          accept="image/*"
          className="bg-accent rounded-sm text-primary p-1"
          onChange={(e) => setPictureFile(e.target.files?.[0] ?? null)}
        />

        {error && <p className="text-red-600">{error}</p>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : artist ? 'Update artist' : 'Add artist'}
        </button>
      </form>
    </div>
  )
}