'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function signup(formData: FormData) {
    const supabase = await createClient()
    const email = formData.get('email') as string

    const data = {
        email: email,
        password: formData.get('password') as string,
        options: {
            data: {
                f_name: formData.get('f_name') as string,
                l_name: formData.get('l_name') as string,
            },
            emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/login`,
        }
    }

    const { data: userData, error: userError } = await supabase.from('users_view')
        .select('email')
        .eq('email', data.email)
        .single()

    if (userData) {
        return { error: 'Email already exists' }
    }

    const { error } = await supabase.auth.signUp(data)
    
    if (error) {
        console.error("Signup error:", error.message)
        return { error: error.message }
    }

    redirect(`/confirmation?email=${encodeURIComponent(email)}`)
}