'use client'

import { useState } from 'react'
import type { Profile } from '@/app/type/profile'
import { updateProfileRole } from '@/app/actions/profiles'

interface UsersPageClientProps {
  initialProfiles: Profile[]
}

const ROLES = ['user', 'admin']

export default function UsersPageClient({ initialProfiles }: UsersPageClientProps) {
  const [profiles, setProfiles] = useState<Profile[]>(initialProfiles)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const handleRoleChange = async (id: string, role: string) => {
    setUpdatingId(id)
    const result = await updateProfileRole(id, role)
    setUpdatingId(null)

    if (!result.success) {
      alert(result.error ?? 'Failed to update role')
      return
    }

    setProfiles((prev) => prev.map((p) => (p.id === id ? { ...p, role } : p)))
  }

  return (
    <div className="w-screen text-center mx-auto">
      <table className="mx-auto border-collapse">
        <thead>
          <tr>
            <th className="px-3 py-2">Username</th>
            <th className="px-3 py-2">Email</th>
            <th className="px-3 py-2">Role</th>
          </tr>
        </thead>
        <tbody>
          {profiles.map((profile) => (
            <tr key={profile.id} className="border-t">
              <td className="px-3 py-2">{profile.username}</td>
              <td className="px-3 py-2">{profile.email}</td>
              <td className="px-3 py-2">
                <select
                  value={profile.role}
                  disabled={updatingId === profile.id}
                  onChange={(e) => handleRoleChange(profile.id, e.target.value)}
                  className="bg-accent rounded-sm text-primary p-1"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}