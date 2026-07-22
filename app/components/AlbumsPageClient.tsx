// app/components/AlbumsPageClient.tsx
'use client'

import AlbumForm from '@/app/components/AlbumForm'
import { useState } from 'react'
import type { Album } from '@/app/type/album'

interface AlbumsPageClientProps {
  initialAlbums: Album[]
}

export default function AlbumsPageClient({ initialAlbums }: AlbumsPageClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [albums, setAlbums] = useState<Album[]>(initialAlbums)

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  return (
    <div className="w-screen text-center mx-auto">
      <table className='mx-auto'>
        <thead>
          <tr className='flex space-x-2'>
            <th>Title</th>
            <th>Release Date</th>
            <th>album cover</th>
            <th>edit</th>
            <th>delete</th>
          </tr>
        </thead>
        <tbody>
          {albums.map((album) => (
            <tr key={album.id}>
              <td>{album.title}</td>
              <td>{album.release_date}</td>
              <td>
                {album.cover_url && (
                  <img src={album.cover_url} alt={album.title} width={50} />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button id="album-form-modal-open" className="mx-auto" onClick={openModal}>
        Add album
      </button>

      {isModalOpen && (
        <div role="dialog" aria-modal="true" aria-labelledby="album-form-modal-title" onClick={closeModal}>
          <button id="album-form-modal-close" onClick={closeModal}>
            Cancel
          </button>
          <div onClick={(e) => e.stopPropagation()}>
            <div className="mx-auto w-1/2">
              <AlbumForm onSuccess={closeModal} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}