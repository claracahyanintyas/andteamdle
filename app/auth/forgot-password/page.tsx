'use client'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { requestPasswordReset } from '@/app/actions/auth' // adjust to your actions file path

function ForgotPasswordForm() {
  const searchParams = useSearchParams()
  const linkError = searchParams.get('error') === 'invalid_link'

  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const result = await requestPasswordReset(email)

    setLoading(false)
    if (result.success) setSent(true)
    else setError(result.error ?? 'Something went wrong')
  }

  if (sent) {
    return (
      <div className="mx-auto mt-24 max-w-sm space-y-4 p-4 text-center">
        <h1 className="text-2xl font-semibold">Check your email</h1>
        <p className="text-sm text-gray-600">
          If an account exists for {email}, we sent a link to reset your password.
        </p>
        <Link href="/auth/login" className="text-sm underline">
          Back to login
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto mt-24 max-w-sm space-y-4 p-4">
      <h1 className="text-2xl font-semibold">Forgot password</h1>
      <p className="text-sm text-gray-600">
        Enter your email and we&apos;ll send you a reset link.
      </p>

      {linkError && (
        <p className="text-sm text-red-600">
          That reset link is invalid or has expired. Please request a new one.
        </p>
      )}

      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="w-full rounded border px-3 py-2"
      />

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded bg-black px-3 py-2 text-white disabled:opacity-50"
      >
        {loading ? 'Sending...' : 'Send reset link'}
      </button>

      <Link href="/auth/login" className="block text-center text-sm underline">
        Back to login
      </Link>
    </form>
  )
}

export default function ForgotPasswordPage() {
  // Suspense is required because useSearchParams is used in the child
  return (
    <Suspense>
      <ForgotPasswordForm />
    </Suspense>
  )
}