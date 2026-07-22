export type Artist = {
    id: number
    name: string
    picture_url: string | null
    group_id: number | null
}
export type ArtistWithGroup = Artist & {
    group: Artist | null
}