'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function signup(formData: FormData) {
    const supabase = await createClient()
    const email = formData.get('email') as string
    const firstName = formData.get('f_name') as string
    const lastName = formData.get('l_name') as string
    
    // Combine first and last name for display name
    const fullName = `${firstName} ${lastName}`.trim()

    const data = {
        email: email,
        password: formData.get('password') as string,
        options: {
            data: {
                full_name: fullName,  // This will be stored in raw_user_meta_data
                f_name: firstName,
                l_name: lastName,
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

    const { data: signUpData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
            data: {
                full_name: fullName,  // This goes to raw_user_meta_data
                first_name: firstName, // Alternative field name
                last_name: lastName,  // Alternative field name
            },
            emailRedirectTo: data.options.emailRedirectTo
        }
    })
    
    if (error) {
        console.error("Signup error:", error.message)
        return { error: error.message }
    }

    // Update the user's profile to set the display name
    if (signUpData.user) {
        const { error: updateError } = await supabase.auth.updateUser({
            data: { full_name: fullName }
        })
        
        if (updateError) {
            console.error("Update user error:", updateError.message)
        }
    }

    redirect(`/confirmation?email=${encodeURIComponent(email)}`)
}