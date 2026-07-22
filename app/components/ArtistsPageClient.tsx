'use client'

import ArtistForm from '@/app/components/ArtistForm'
import { useState } from 'react'
import type { Artist } from '@/app/type/artist'

interface ArtistsPageClientProps {
  initialArtists: Artist[]
}

export default function ArtistsPageClient({ initialArtists }: ArtistsPageClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [artists, setArtists] = useState<Artist[]>(initialArtists)

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  return (
    <div className="w-screen text-center mx-auto">
      <table className="mx-auto">
        <thead>
          <tr className="flex space-x-2">
            <th>Name</th>
            <th>Type</th>
            <th>Picture</th>
            <th>edit</th>
            <th>delete</th>
          </tr>
        </thead>
        <tbody>
          {artists.map((artist) => (
            <tr key={artist.id}>
              <td>{artist.name}</td>
              <td>{artist.type}</td>
              <td>
                {artist.picture_url && (
                  <img src={artist.picture_url} alt={artist.name} width={50} />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button id="artist-form-modal-open" className="mx-auto" onClick={openModal}>
        Add artist
      </button>

      {isModalOpen && (
        <div role="dialog" aria-modal="true" aria-labelledby="artist-form-modal-title" onClick={closeModal}>
          <button id="artist-form-modal-close" onClick={closeModal}>
            Cancel
          </button>
          <div onClick={(e) => e.stopPropagation()}>
            <div className="mx-auto w-1/2">
              <ArtistForm onSuccess={closeModal} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}