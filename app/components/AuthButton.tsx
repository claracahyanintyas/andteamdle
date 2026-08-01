'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/app/utils/supabase/client'
import { signOut } from '@/app/actions/auth'
import type { User } from '@supabase/supabase-js'

const linkClass = 'py-2 px-4 mx-2 border-2 bg-secondary rounded-sm hover:text-accent'

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      setIsLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  if (isLoading) {
    return <div className="w-24 h-10" /> // placeholder to avoid layout shift
  }

  if (!user) {
    return (
      <>
        <a href="/auth/login" className={linkClass}>
          Login
        </a>
        <a href="/auth/register" className={linkClass}>
          Register
        </a>
      </>
    )
  }

  return (
    <form action={signOut}>
      <button type="submit" className={linkClass}>
        Log out
      </button>
    </form>
  )
}