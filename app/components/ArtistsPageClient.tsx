'use client'

import ArtistForm from '@/app/components/ArtistForm'
import { useState } from 'react'
import type { ArtistWithGroup, Artist } from '@/app/type/artist'
import { getArtists, deleteArtist } from '@/app/actions/artists'

interface ArtistsPageClientProps {
  initialArtists: ArtistWithGroup[]
}

export default function ArtistsPageClient({ initialArtists }: ArtistsPageClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [artists, setArtists] = useState<ArtistWithGroup[]>(initialArtists)
  const [editingArtist, setEditingArtist] = useState<Artist | undefined>(undefined)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const openAddModal = () => {
    setEditingArtist(undefined)
    setIsModalOpen(true)
  }

  const openEditModal = (artist: Artist) => {
    setEditingArtist(artist)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingArtist(undefined)
  }

  const refreshArtists = async () => {
    const result = await getArtists()
    if (result.success) setArtists(result.artists)
    console.log(result.artists)
  }

  const handleFormSuccess = async () => {
    await refreshArtists()
    closeModal()
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this artist?')) return
    setDeletingId(id)
    const result = await deleteArtist(id)
    setDeletingId(null)

    if (!result.success) {
      alert(result.error ?? 'Failed to delete artist')
      return
    }

    setArtists((prev) => prev.filter((a) => a.id !== id))
  }

  return (
    <div className="w-screen text-center mx-auto">
      <table className="mx-auto border-collapse">
        <thead>
          <tr className="">
            <th className="px-3 py-2">Name</th>
            <th className="px-3 py-2">Group</th>
            <th className="px-3 py-2">Picture</th>
            <th className="px-3 py-2">edit</th>
            <th className="px-3 py-2">delete</th>
          </tr>
        </thead>
        <tbody>
          {artists.map((artist) => (
            <tr key={artist.id} className="border-t">
              <td className="px-3 py-2">{artist.name}</td>
              <td className="px-3 py-2">{artist.group?.name}</td>
              <td className="px-3 py-2">
                {artist.picture_url && (
                  <img src={artist.picture_url} alt={artist.group?.name} width={50} />
                )}
              </td>
              <td className="px-3 py-2">
                <button onClick={() => openEditModal(artist)}>Edit</button>
              </td>
              <td className="px-3 py-2">
                <button
                  onClick={() => handleDelete(artist.id)}
                  disabled={deletingId === artist.id}
                >
                  {deletingId === artist.id ? 'Deleting...' : 'Delete'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button id="artist-form-modal-open" className="mx-auto" onClick={openAddModal}>
        Add artist
      </button>

      {isModalOpen && (
        <div role="dialog" aria-modal="true" aria-labelledby="artist-form-modal-title" onClick={closeModal}>
          <button id="artist-form-modal-close" onClick={closeModal}>
            Cancel
          </button>
          <div onClick={(e) => e.stopPropagation()}>
            <div className="mx-auto w-1/2">
              <ArtistForm artist={editingArtist} onSuccess={handleFormSuccess} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}