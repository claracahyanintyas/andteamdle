// app/components/AlbumsPageClient.tsx
'use client'

import AlbumForm from '@/app/components/AlbumForm'
import { useState } from 'react'
import type { Album } from '@/app/type/album'
import { deleteAlbum, getAlbums } from '../actions/albums'

interface AlbumsPageClientProps {
  initialAlbums: Album[]
}

export default function AlbumsPageClient({ initialAlbums }: AlbumsPageClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [albums, setAlbums] = useState<Album[]>(initialAlbums)
  const [editingAlbum, setEditingAlbum] = useState<Album | undefined>(undefined)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const openAddModal = () => {
    setEditingAlbum(undefined)
    setIsModalOpen(true)
  }

  const openEditModal = (album: Album) => {
    setEditingAlbum(album)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingAlbum(undefined)
  }

  const refreshArtists = async () => {
    const result = await getAlbums()
    if (result.success) setAlbums(result.albums)
    console.log(result.albums)
  }

  const handleFormSuccess = async () => {
    await refreshArtists()
    closeModal()
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this album?')) return
    setDeletingId(id)
    const result = await deleteAlbum(id)
    setDeletingId(null)

    if (!result.success) {
      alert(result.error ?? 'Failed to delete artist')
      return
    }

    setAlbums((prev) => prev.filter((a) => a.id !== id))
  }



  return (
    <div className="w-screen text-center mx-auto">
      <table className='mx-auto border-collapse'>
        <thead>
          <tr className=''>
            <th className="px-3 py-2">Title</th>
            <th className="px-3 py-2">Release Date</th>
            <th className="px-3 py-2">album cover</th>
            <th className="px-3 py-2">edit</th>
            <th className="px-3 py-2">delete</th>
          </tr>
        </thead>
        <tbody>
          {albums.map((album) => (
            <tr key={album.id}  className="border-t">
              <td className="px-3 py-2">{album.title}</td>
              <td className="px-3 py-2">{album.release_date}</td>
              <td className="px-3 py-2">
                {album.cover_url && (
                  <img src={album.cover_url} alt={album.title} width={50} />
                )}
              </td>
              <td className="px-3 py-2">
                <button onClick={() => openEditModal(album)}>Edit</button>
              </td>
              <td className="px-3 py-2">
                <button
                  onClick={() => handleDelete(album.id)}
                  disabled={deletingId === album.id}
                >
                  {deletingId === album.id ? 'Deleting...' : 'Delete'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button id="album-form-modal-open" className="mx-auto" onClick={openAddModal}>
        Add album
      </button>

      {isModalOpen && (
        <div role="dialog" aria-modal="true" aria-labelledby="artist-form-modal-title" onClick={closeModal}>
          <button id="artist-form-modal-close" onClick={closeModal}>
            Cancel
          </button>
          <div onClick={(e) => e.stopPropagation()}>
            <div className="mx-auto w-1/2">
              <AlbumForm album={editingAlbum} onSuccess={handleFormSuccess} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}