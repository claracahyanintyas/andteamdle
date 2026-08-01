// app/admin/users/page.tsx
import { redirect } from 'next/navigation'
import { getCurrentProfile } from '@/app/actions/auth'
import { getProfiles } from '@/app/actions/profiles'
import UsersPageClient from '@/app/components/UsersPageClient'

export default async function UsersPage() {
  const { profile } = await getCurrentProfile()

  if (!profile || profile.role !== 'admin') {
    redirect('/')
  }

  const result = await getProfiles()
  return <UsersPageClient initialProfiles={result.profiles} />
}