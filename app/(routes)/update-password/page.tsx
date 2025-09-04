// app/update-password/page.tsx
"use client";

import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

interface FormData {
  password: string;
  confirmPassword: string;
}

function UpdatePassword() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<FormData>();

  const password = watch("password");

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setMessage(null);
    
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        password: data.password
      });

      if (error) {
        throw error;
      }

      setMessage({
        type: 'success',
        text: 'Password updated successfully! Redirecting to login...'
      });
      
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (error: any) {
      console.error('Password update error:', error);
      setMessage({
        type: 'error',
        text: error.message || 'Failed to update password. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex justify-center items-center min-h-screen bg-gray-50 px-4 py-8">
      <div className="w-125 mx-auto rounded-xl border border-gray-300 shadow-lg bg-white">
        <div className="w-full text-[#161616] flex flex-col items-center justify-start p-10">
          <h1 className="text-3xl font-bold mb-6 text-center">
            Update Password
          </h1>

          {/* Message Display */}
          {message && (
            <div className={`w-full p-3 rounded mb-4 text-center ${
              message.type === 'success' 
                ? 'bg-green-100 text-green-700 border border-green-300' 
                : 'bg-red-100 text-red-700 border border-red-300'
            }`}>
              {message.text}
            </div>
          )}

          {/* Form Inputs */}
          <form className="w-full flex flex-col gap-4" autoComplete="off"
            onSubmit={handleSubmit(onSubmit)}>
            <div className="relative w-full">
              <input
                type="password"
                placeholder="New Password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters"
                  }
                })}
                className={`w-full p-3 pl-6 rounded border ${errors.password ? "border-red-500" : "border-gray-300"} 
                  bg-opacity-20 text-black outline-none focus:border-[#f2c10f] placeholder:text-gray appearance-none`}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            <div className="relative w-full">
              <input
                type="password"
                placeholder="Confirm Password"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: value => value === password || "Passwords do not match"
                })}
                className={`w-full p-3 pl-6 rounded border ${errors.confirmPassword ? "border-red-500" : "border-gray-300"} 
                  bg-opacity-20 text-black outline-none focus:border-[#f2c10f] placeholder:text-gray appearance-none`}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              disabled={isSubmitting}
              className={`${
                isSubmitting 
                  ? "cursor-not-allowed opacity-70" 
                  : "cursor-pointer"
              } w-full mx-auto group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-md border border-[#f2c10f] px-10 font-medium text-white transition-all duration-100 [box-shadow:5px_5px_rgb(186_130_9)] hover:translate-x-[3px] hover:translate-y-[3px] hover:[box-shadow:0px_0px_rgb(82_82_82)] bg-[#f2c10f] text-lg`}
              type="submit"
            >
              <b>
                {isSubmitting ? (
                  <span className="flex items-center">
                    <AiOutlineLoading3Quarters className="animate-spin mr-2 w-5 h-5"/>
                    Updating...
                  </span>
                ) : (
                  "Update Password"
                )}
              </b>
            </button>
          </form>
          
          <Link href="/login" className="text-base mt-6">
            <span className="cursor-pointer after:block after:h-[2px] after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-full">
              Return to login
            </span>
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function UpdatePasswordFinal() {
    return (
        <Suspense>
            <UpdatePassword />
        </Suspense>
    )
}