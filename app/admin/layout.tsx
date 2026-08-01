import { redirect } from 'next/navigation'
import { getCurrentProfile } from '@/app/actions/auth'
import AdminNavbar from '../components/AdminNavbar'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { profile } = await getCurrentProfile()

  if (!profile || profile.role !== 'admin') {
    redirect('/')
  }

  return <div className='flex'> <AdminNavbar></AdminNavbar>{children}</div>
}