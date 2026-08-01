export type Profile = {
  id: string          // uuid, matches auth.users.id
  email: string | null
  username: string
  role: string
  created_at: string
}