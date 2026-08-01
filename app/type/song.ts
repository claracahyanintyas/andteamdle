import { Album } from "./album"
import { Artist } from "./artist"

export type Song = {
  id: number
  title: string
  language: string
  album_id: number
  has_mv: boolean 
  release_date: string
  starter_id: number | null
  artist_id: number
}

export type SongWithRelations = Song & {
    artist: Artist
    album: Album
    starter: Artist | null
}