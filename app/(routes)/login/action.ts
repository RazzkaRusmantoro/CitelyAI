// 'use server'

// import { revalidatePath } from 'next/cache'
// import { redirect } from 'next/navigation'
// import { createClient } from '@/utils/supabase/server'

// export async function login(formData: FormData) {
//   const supabase = await createClient()

//   // type-casting here for convenience
//   // in practice, you should validate your inputs
//   const data = {
//     email: formData.get('email') as string,
//     password: formData.get('password') as string,
//   }

//   const { data: userData, error: userError } = await supabase.from('users_view')
//     .select('email')
//     .eq('email', data.email)
//     .single()

//   if (!userData) {
//     return { error: 'Email not found' }
//   }

//   const { error } = await supabase.auth.signInWithPassword(data)

//   if (error) {  
//     return { error: 'Invalid login credentials'}
//   }

//   revalidatePath('/', 'layout')
//   redirect('/')
// }
