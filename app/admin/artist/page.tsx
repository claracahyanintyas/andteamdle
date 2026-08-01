// app/admin/artist/page.tsx (adjust path to match your routing)
import { getArtists } from '@/app/actions/artists'
import ArtistsPageClient from '@/app/components/ArtistsPageClient'

export default async function Page() {
  const result = await getArtists()
  const artists = result.success ? result.artists : []

  return <ArtistsPageClient initialArtists={artists} />
}