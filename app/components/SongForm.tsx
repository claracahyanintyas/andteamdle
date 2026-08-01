'use client'

import { useState, useEffect, FormEvent } from 'react'
import type { SongWithRelations } from '@/app/type/song'
import type { Album } from '@/app/type/album'
import type { Artist } from '@/app/type/artist'
import { createSong, updateSong } from '@/app/actions/songs'
import { getAlbums } from '@/app/actions/albums'
import { getArtists } from '@/app/actions/artists'

interface SongFormProps {
  song?: SongWithRelations
  onSuccess?: () => void
}

export default function SongForm({ song, onSuccess }: SongFormProps) {
  const [title, setTitle] = useState(song?.title ?? '')
  const [language, setLanguage] = useState(song?.language ?? '')
  const [releaseDate, setReleaseDate] = useState(song?.release_date ?? '')
  const [hasMv, setHasMv] = useState(song?.has_mv ?? false)
  const [albumId, setAlbumId] = useState<number | ''>(song?.album_id ?? '')
  const [artistId, setArtistId] = useState<number | ''>(song?.artist_id ?? '')
  const [starterId, setStarterId] = useState<number | ''>(song?.starter_id ?? '')

  const [albums, setAlbums] = useState<Album[]>([])
  const [artists, setArtists] = useState<Artist[]>([])
  const [isLoadingOptions, setIsLoadingOptions] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadOptions() {
      const [albumsResult, artistsResult] = await Promise.all([getAlbums(), getArtists()])
      if (albumsResult.success) setAlbums(albumsResult.albums)
      if (artistsResult.success) setArtists(artistsResult.artists)
      setIsLoadingOptions(false)
    }
    loadOptions()
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    if (albumId === '' || artistId === '') {
      setError('Album and artist are required')
      setIsSubmitting(false)
      return
    }

    const input = {
      title,
      language,
      release_date: releaseDate,
      has_mv: hasMv,
      album_id: Number(albumId),
      artist_id: Number(artistId),
      starter_id: starterId === '' ? null : Number(starterId),
    }

    const result = song
      ? await updateSong(song.id, input)
      : await createSong(input)

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
        <label htmlFor="title">Song title</label>
        <input
          type="text"
          id="title"
          value={title}
          className="bg-accent rounded-sm text-primary p-1"
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label htmlFor="artist">Artist</label>
        <select
          id="artist"
          value={artistId}
          className="bg-accent rounded-sm text-primary p-1"
          onChange={(e) => setArtistId(e.target.value ? Number(e.target.value) : '')}
          required
        >
          <option value="">Select an artist</option>
          {artists.map((artist) => (
            <option key={artist.id} value={artist.id}>
              {artist.name}
            </option>
          ))}
        </select>

        <label htmlFor="album">Album</label>
        <select
          id="album"
          value={albumId}
          className="bg-accent rounded-sm text-primary p-1"
          onChange={(e) => setAlbumId(e.target.value ? Number(e.target.value) : '')}
          required
        >
          <option value="">Select an album</option>
          {albums.map((album) => (
            <option key={album.id} value={album.id}>
              {album.title}
            </option>
          ))}
        </select>

        <label htmlFor="starter">Starter (optional)</label>
        <select
          id="starter"
          value={starterId}
          className="bg-accent rounded-sm text-primary p-1"
          onChange={(e) => setStarterId(e.target.value ? Number(e.target.value) : '')}
        >
          <option value="">None</option>
          {artists.map((artist) => (
            <option key={artist.id} value={artist.id}>
              {artist.name}
            </option>
          ))}
        </select>

        <label htmlFor="language">Language</label>
        <input
          type="text"
          id="language"
          value={language}
          className="bg-accent rounded-sm text-primary p-1"
          onChange={(e) => setLanguage(e.target.value)}
          required
        />

        <label htmlFor="release-date">Release date</label>
        <input
          type="date"
          id="release-date"
          value={releaseDate}
          className="w-full bg-accent rounded-sm text-primary p-1"
          onChange={(e) => setReleaseDate(e.target.value)}
          required
        />

        <label htmlFor="has-mv" className="flex items-center gap-2 justify-center">
          <input
            type="checkbox"
            id="has-mv"
            checked={hasMv}
            onChange={(e) => setHasMv(e.target.checked)}
          />
          Has music video
        </label>

        {error && <p className="text-red-600">{error}</p>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : song ? 'Update song' : 'Add song'}
        </button>
      </form>
    </div>
  )
}