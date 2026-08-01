import { getSongs } from '@/app/actions/songs'
import SongsPageClient from '@/app/components/SongsPageClient'

export default async function Page() {
  const result = await getSongs()
  const songs = result.success ? result.songs : []

  return <SongsPageClient initialSongs={songs} />
}