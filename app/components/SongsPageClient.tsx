'use client'

import SongForm from '@/app/components/SongForm'
import { useState } from 'react'
import type { SongWithRelations } from '@/app/type/song'
import type { Song } from '@/app/type/song'
import { getSongs, deleteSong } from '@/app/actions/songs'

interface SongsPageClientProps {
  initialSongs: SongWithRelations[]
}

export default function SongsPageClient({ initialSongs }: SongsPageClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [songs, setSongs] = useState<SongWithRelations[]>(initialSongs)
  const [editingSong, setEditingSong] = useState<SongWithRelations | undefined>(undefined)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const openAddModal = () => {
    setEditingSong(undefined)
    setIsModalOpen(true)
  }

  const openEditModal = (song: SongWithRelations) => {
    setEditingSong(song)
    setIsModalOpen(true)
  }


  const closeModal = () => {
    setIsModalOpen(false)
    setEditingSong(undefined)
  }

  const refreshSongs = async () => {
    const result = await getSongs()
    if (result.success) setSongs(result.songs)
  }

  const handleFormSuccess = async () => {
    await refreshSongs()
    closeModal()
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this song?')) return
    setDeletingId(id)
    const result = await deleteSong(id)
    setDeletingId(null)

    if (!result.success) {
      alert(result.error ?? 'Failed to delete song')
      return
    }

    setSongs((prev) => prev.filter((s) => s.id !== id))
  }

  return (
    <div className="w-screen text-center mx-auto">
      <table className="mx-auto border-collapse">
        <thead>
          <tr>
            <th className="px-3 py-2">Title</th>
            <th className="px-3 py-2">Artist</th>
            <th className="px-3 py-2">Album</th>
            <th className="px-3 py-2">Release Date</th>
            <th className="px-3 py-2">Language</th>
            <th className="px-3 py-2">Has MV</th>
            <th className="px-3 py-2">edit</th>
            <th className="px-3 py-2">delete</th>
          </tr>
        </thead>
        <tbody>
          {songs.map((song) => (
            <tr key={song.id} className="border-t">
              <td className="px-3 py-2">{song.title}</td>
              <td className="px-3 py-2">{song.artist.name}</td>
              <td className="px-3 py-2">{song.album.title}</td>
              <td className="px-3 py-2">{song.release_date}</td>
              <td className="px-3 py-2">{song.language}</td>
              <td className="px-3 py-2">{song.has_mv ? 'Yes' : 'No'}</td>
              <td className="px-3 py-2">
                <button onClick={() => openEditModal(song)}>Edit</button>
              </td>
              <td className="px-3 py-2">
                <button
                  onClick={() => handleDelete(song.id)}
                  disabled={deletingId === song.id}
                >
                  {deletingId === song.id ? 'Deleting...' : 'Delete'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button id="song-form-modal-open" className="mx-auto mt-4" onClick={openAddModal}>
        Add song
      </button>

      {isModalOpen && (
        <div role="dialog" aria-modal="true" aria-labelledby="song-form-modal-title" onClick={closeModal}>
          <button id="song-form-modal-close" onClick={closeModal}>
            Cancel
          </button>
          <div onClick={(e) => e.stopPropagation()}>
            <div className="mx-auto w-1/2">
              <SongForm song={editingSong} onSuccess={handleFormSuccess} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}