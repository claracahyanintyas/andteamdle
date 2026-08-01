'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from '@/app/actions/auth'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const result = await signIn(email, password)

    setIsSubmitting(false)

    if (!result.success) {
      setError(result.error ?? 'Something went wrong')
      return
    }

    router.push('/')
    router.refresh()
  }

  return (
    <div className="bg-secondary text-center rounded-lg">
      <form onSubmit={handleSubmit} className="flex flex-col p-2 gap-2">
        <h1 className="text-xl font-bold">Log in</h1>

        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          className="bg-accent rounded-sm text-primary p-1"
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          className="bg-accent rounded-sm text-primary p-1"
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="text-red-600">{error}</p>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Logging in...' : 'Log in'}
        </button>

        <a href="/auth/register" className="text-sm underline">
          Don't have an account? Register
        </a>
      </form>
    </div>
  )
}