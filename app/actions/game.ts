'use server'

import { createClient } from '@/app/utils/supabase/server'
import type { GuessResult } from '@/app/type/game'

export async function getOrCreateTodaysSession(localDate: string) {
  const supabase = await createClient()

  let {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    const { data, error: anonError } = await supabase.auth.signInAnonymously()

    if (anonError || !data.user) {
      console.error('ANON SIGN IN ERROR:', anonError)
      return { success: false, error: 'Could not start a guest session', session: null }
    }

    user = data.user
  }

  const today = localDate // e.g. '2026-08-10', computed on the client from their local clock

  // get or create today's global answer (defaults to &TEAM inside the SQL function)
  const { data: songId, error: puzzleError } = await supabase.rpc(
    'get_or_create_daily_puzzle',
    { p_date: today }
  )

  if (puzzleError || !songId) {
    console.error('DAILY PUZZLE ERROR:', puzzleError)
    return { success: false, error: 'Could not load today\'s puzzle', session: null }
  }

  // check if this user already has a session for today
  const { data: existingSession, error: fetchError } = await supabase
    .from('game_session')
    .select('*')
    .eq('user_id', user.id)
    .eq('game_date', today)
    .maybeSingle()

  if (fetchError) {
    console.error('SESSION FETCH ERROR:', fetchError)
    return { success: false, error: fetchError.message, session: null }
  }

  if (existingSession) {
    return { success: true, error: null, session: existingSession }
  }

  // no session yet today — create one
  const { data: newSession, error: insertError } = await supabase
    .from('game_session')
    .insert({
      user_id: user.id,
      game_date: today,
      target_song_id: songId,
      max_attempt: 6,
    })
    .select()
    .single()

  if (insertError) {
    console.error('SESSION INSERT ERROR:', insertError)
    return { success: false, error: insertError.message, session: null }
  }

  return { success: true, error: null, session: newSession }
}

export async function getSongsForGroup(groupArtistId: number = 1) {
  const supabase = await createClient()

  // find the group itself plus every member (artist rows whose group_id points to it)
  const { data: members, error: membersError } = await supabase
    .from('artists')
    .select('id')
    .or(`id.eq.${groupArtistId},group_id.eq.${groupArtistId}`)

  if (membersError) {
    console.error('GET MEMBERS ERROR:', membersError)
    return { success: false, error: membersError.message, songs: [] }
  }

  const artistIds = (members ?? []).map((m) => m.id)

  const { data, error } = await supabase
    .from('songs')
    .select('id, title')
    .in('artist_id', artistIds)
    .order('title')

  if (error) {
    console.error('GET SONGS ERROR:', error)
    return { success: false, error: error.message, songs: [] }
  }

  return { success: true, error: null, songs: data ?? [] }
}

export async function getSessionAttempts(sessionId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.rpc('get_session_attempts', {
    p_session_id: sessionId,
  })

  if (error) {
    console.error('GET SESSION ATTEMPTS ERROR:', error)
    return { success: false, error: error.message, guesses: [] as GuessResult[] }
  }

  return { success: true, error: null, guesses: (data ?? []) as GuessResult[] }
}

export async function submitGuess(sessionId: string, guessedSongId: number) {
  const supabase = await createClient()

  const { data, error } = await supabase.rpc('submit_guess', {
    p_session_id: sessionId,
    p_guess_song_id: guessedSongId,
  })

  if (error) {
    console.error('SUBMIT GUESS ERROR:', error)
    return { success: false, error: error.message, result: null }
  }

  return {
    success: true,
    error: null,
    result: (data?.[0] ?? null) as (GuessResult & { attempts_used: number; is_completed: boolean }) | null,
  }
}