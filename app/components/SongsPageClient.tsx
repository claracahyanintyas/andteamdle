// app/components/SongsPageClient.tsx
'use client'

import SongForm from '@/app/components/SongForm'
import { useState } from 'react'
import type { SongWithRelations } from '@/app/type/song'

interface SongsPageClientProps {
  initialSongs: SongWithRelations[]
}

export default function SongsPageClient({ initialSongs }: SongsPageClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [songs, setSongs] = useState<SongWithRelations[]>(initialSongs)

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  return (
    <div className="w-screen text-center mx-auto">
      <table className="mx-auto">
        <thead>
          <tr className="flex space-x-2">
            <th>Title</th>
            <th>Artist</th>
            <th>Album</th>
            <th>Release Date</th>
            <th>Language</th>
            <th>Has MV</th>
            <th>edit</th>
            <th>delete</th>
          </tr>
        </thead>
        <tbody>
          {songs.map((song) => (
            <tr key={song.id}>
              <td>{song.title}</td>
              <td>{song.artist.name}</td>
              <td>{song.album.title}</td>
              <td>{song.release_date}</td>
              <td>{song.language}</td>
              <td>{song.has_mv ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button id="song-form-modal-open" className="mx-auto" onClick={openModal}>
        Add song
      </button>

      {isModalOpen && (
        <div role="dialog" aria-modal="true" aria-labelledby="song-form-modal-title" onClick={closeModal}>
          <button id="song-form-modal-close" onClick={closeModal}>
            Cancel
          </button>
          <div onClick={(e) => e.stopPropagation()}>
            <div className="mx-auto w-1/2">
              <SongForm onSuccess={closeModal} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}