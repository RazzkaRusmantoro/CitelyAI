"use server";

import { createClient } from '@/utils/supabase/server';

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
}