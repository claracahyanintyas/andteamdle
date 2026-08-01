'use client'

import { useState, FormEvent, useEffect } from 'react'
import type { Artist } from '@/app/type/artist'
import { createArtist, updateArtist, getArtists } from '@/app/actions/artists'
import { createClient } from '@/app/utils/supabase/client'

interface ArtistFormProps {
  artist?: Artist
  onSuccess?: () => void
}

export default function ArtistForm({ artist, onSuccess }: ArtistFormProps) {
  const [name, setName] = useState(artist?.name ?? '')
  const [groupId, setGroupId] = useState<number | ''>(artist?.group_id ?? '')
  const [pictureFile, setPictureFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [artists, setArtists] = useState<Artist[]>([])
  const [isLoadingOptions, setIsLoadingOptions] = useState(true)

  useEffect(() => {
    async function loadOptions() {
      const [artistsResult] = await Promise.all([getArtists()])
      if (artistsResult.success) setArtists(artistsResult.artists)
      setIsLoadingOptions(false)
    }
    loadOptions()
  }, [])

  // keep form in sync if the same instance is reused for a different artist (e.g. edit modal swap)
  useEffect(() => {
    setName(artist?.name ?? '')
    setGroupId(artist?.group_id ?? '')
  }, [artist])

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
      ? await updateArtist(artist.id, { name, group_id: groupId || null, picture_url: pictureUrl })
      : await createArtist({ name, group_id: groupId || null, picture_url: pictureUrl })

    setIsSubmitting(false)

    if (!result.success) {
      setError(result.error ?? 'Something went wrong')
      return
    }

    onSuccess?.()
  }

  if (isLoadingOptions) {
    return <div className="bg-secondary text-center rounded-lg p-4">Loading...</div>
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

        <label htmlFor="picture">Picture</label>
        <input
          type="file"
          id="picture"
          accept="image/*"
          className="bg-accent rounded-sm text-primary p-1"
          onChange={(e) => setPictureFile(e.target.files?.[0] ?? null)}
        />

        <label htmlFor="group">Group</label>
        <select
          id="group"
          value={groupId}
          className="bg-accent rounded-sm text-primary p-1"
          onChange={(e) => setGroupId(e.target.value ? Number(e.target.value) : '')}
        >
          <option value="">Select a group</option>
          {artists
            .filter((a) => !artist || a.id !== artist.id) // don't let an artist be its own group
            .map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
        </select>

        {error && <p className="text-red-600">{error}</p>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : artist ? 'Update artist' : 'Add artist'}
        </button>
      </form>
    </div>
  )
}