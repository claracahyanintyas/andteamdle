'use client'

import { useEffect, useState } from 'react'
import { getOrCreateTodaysSession, getSongsForGroup, getSessionAttempts } from '@/app/actions/game'
import GuessForm from './GuessForm'
import type { GuessResult } from '@/app/type/game'

function getLocalDateString() {
  const d = new Date()
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}` // reflects the PLAYER's local calendar day, not UTC
}

interface Song {
  id: number
  title: string
}

interface SessionData {
  id: string
  is_completed: boolean
}

export default function GameLoader() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [session, setSession] = useState<SessionData | null>(null)
  const [songs, setSongs] = useState<Song[]>([])
  const [guesses, setGuesses] = useState<GuessResult[]>([])

  useEffect(() => {
    async function load() {
      const localDate = getLocalDateString()

      const sessionResult = await getOrCreateTodaysSession(localDate)

      if (!sessionResult.success || !sessionResult.session) {
        setError(sessionResult.error ?? 'Could not load today\'s puzzle')
        setLoading(false)
        return
      }

      const [songsResult, attemptsResult] = await Promise.all([
        getSongsForGroup(),
        getSessionAttempts(sessionResult.session.id),
      ])

      setSession(sessionResult.session)
      setSongs(songsResult.songs)
      setGuesses(attemptsResult.guesses)
      setLoading(false)
    }

    load()
  }, [])

  if (loading) return <div className="text-center p-8">Loading today&apos;s puzzle...</div>
  if (error || !session) return <div className="text-center p-8 text-red-600">{error}</div>

  return (
    <GuessForm
      sessionId={session.id}
      songs={songs}
      initialGuesses={guesses}
      isCompleted={session.is_completed}
    />
  )
}