'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { signUp } from '@/app/actions/auth'

export default function RegisterForm() {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setIsSubmitting(true)

    const result = await signUp(email, password, username)

    setIsSubmitting(false)

    if (!result.success) {
      setError(result.error ?? 'Something went wrong')
      return
    }

    setSuccess(true)
  }

  if (success) {
    return (
      <div className="bg-secondary text-center rounded-lg p-4">
        <p>Check your email to confirm your account before logging in.</p>
        <button onClick={() => router.push('/auth/login')} className="underline mt-2">
          Go to login
        </button>
      </div>
    )
  }

  return (
    <div className="bg-secondary text-center rounded-lg">
      <form onSubmit={handleSubmit} className="flex flex-col p-2 gap-2">
        <h1 className="text-xl font-bold">Register</h1>

        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          value={username}
          className="bg-accent rounded-sm text-primary p-1"
          onChange={(e) => setUsername(e.target.value)}
          required
        />

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
          minLength={6}
        />

        <label htmlFor="confirm-password">Confirm password</label>
        <input
          type="password"
          id="confirm-password"
          value={confirmPassword}
          className="bg-accent rounded-sm text-primary p-1"
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        {error && <p className="text-red-600">{error}</p>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating account...' : 'Register'}
        </button>

        <a href="/auth/login" className="text-sm underline">
          Already have an account? Log in
        </a>
      </form>
    </div>
  )
}