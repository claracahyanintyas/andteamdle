'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updatePassword } from '@/app/actions/auth' // adjust to your actions file path

export default function UpdatePasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    const result = await updatePassword(password)
    setLoading(false)

    if (!result.success) {
      setError(result.error ?? 'Something went wrong')
      return
    }

    router.push('/')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto mt-24 max-w-sm space-y-4 p-4">
      <h1 className="text-2xl font-semibold">Set a new password</h1>

      <input
        type="password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="New password"
        autoComplete="new-password"
        className="w-full rounded border px-3 py-2"
      />

      <input
        type="password"
        required
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        placeholder="Confirm new password"
        autoComplete="new-password"
        className="w-full rounded border px-3 py-2"
      />

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded bg-black px-3 py-2 text-white disabled:opacity-50"
      >
        {loading ? 'Updating...' : 'Update password'}
      </button>
    </form>
  )
}