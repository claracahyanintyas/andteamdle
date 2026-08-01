'use server'

import { createClient } from '@/app/utils/supabase/server'
import { redirect } from 'next/navigation'
import type { Profile } from '@/app/type/profile'

// ---------- SIGN UP ----------
export async function signUp(email: string, password: string, username: string) {
  const supabase = await createClient()

  // pre-check for a friendlier error than a raw trigger failure
  const { data: existing } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', username)
    .maybeSingle()

  if (existing) {
    return { success: false, error: 'Username is already taken' }
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username },
    },
  })

  if (error) return { success: false, error: error.message }

  return { success: true }
}

// ---------- SIGN IN ----------
export async function signIn(email: string, password: string) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) return { success: false, error: error.message }

  return { success: true }
}

// ---------- SIGN OUT ----------
export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}

// ---------- GET CURRENT USER + PROFILE ----------
export async function getCurrentProfile() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, profile: null as Profile | null }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) return { success: false, profile: null as Profile | null }

  return { success: true, profile: data as Profile }
}