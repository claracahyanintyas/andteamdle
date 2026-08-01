// app/page.tsx (Server Component - no 'use client')
import { getAlbums } from '@/app/actions/albums'
import AlbumsPageClient from '@/app/components/AlbumsPageClient'

export default async function Page() {
  const result = await getAlbums()
  const albums = result.success ? result.albums : []

  return <AlbumsPageClient initialAlbums={albums} />
}