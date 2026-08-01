'use server'

import { createClient } from '@/app/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Profile } from '@/app/type/profile'

export async function getProfiles() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('username', { ascending: true })

  if (error) return { success: false, error: error.message, profiles: [] as Profile[] }

  return { success: true, profiles: data as Profile[] }
}

export async function updateProfileRole(id: string, role: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', id)
    .select()
    .single()

  if (error) return { success: false, error: error.message }

  revalidatePath('/admin/users')
  return { success: true, profile: data as Profile }
}