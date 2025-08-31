"use client";

import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useState } from "react";

interface FormData {
  email: string;
}

export default function PasswordReset() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setMessage(null);
    
    try {
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: data.email }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send reset instructions');
      }

      setMessage({
        type: 'success',
        text: 'Password reset instructions have been sent to your email!'
      });
      reset();
    } catch (error: any) {
      console.error('Password reset error:', error);
      setMessage({
        type: 'error',
        text: error.message || 'Failed to send reset instructions. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="relative flex flex-col md:flex-row justify-center items-center min-h-screen bg-gray-50 px-4">
      <div className="w-125 h-100 flex items-center justify-center mx-auto rounded-xl border border-gray-300 shadow-lg">
        <div className="w-full max-w-lg text-[#161616] flex flex-col items-center justify-start p-6 relative z-10">
          <h1 className="relative bottom-7 text-3xl md:text-3xl font-bold mb-4 mt-6 md:mt-10 text-center">
            Reset Password
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
          <form className="w-full md:w-[100%] flex flex-col gap-4" autoComplete="off"
            onSubmit={handleSubmit(onSubmit)}>
            <div className="relative w-full">
              <input
                type="email"
                placeholder="Email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address"
                  }
                })}
                className={`w-full p-3 pl-6 rounded border ${errors.email ? "border-red-500" : "border-gray-300"} 
                  bg-opacity-20 text-black outline-none focus:border-[#f2c10f] placeholder:text-gray appearance-none`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <button
              disabled={isSubmitting}
              className={`${
                isSubmitting 
                  ? "cursor-not-allowed opacity-70" 
                  : "cursor-pointer"
              } w-full md:w-[80%] mx-auto group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-md border border-[#f2c10f] px-10 font-medium text-white transition-all duration-100 [box-shadow:5px_5px_rgb(186_130_9)] hover:translate-x-[3px] hover:translate-y-[3px] hover:[box-shadow:0px_0px_rgb(82_82_82)] bg-[#f2c10f] text-lg`}
              type="submit"
            >
              <b>
                {isSubmitting ? (
                  <span className="flex items-center">
                    <AiOutlineLoading3Quarters className="animate-spin mr-2 w-5 h-5"/>
                    Sending...
                  </span>
                ) : (
                  "Send Reset Instructions"
                )}
              </b>
            </button>
          </form>
          
          <Link href="/login" className="text-base mt-5">
            <span className="mt-5 relative cursor-pointer after:block mb-0 after:h-[2px] after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-full">
              Return to login
            </span>
          </Link>
        </div>
      </div>
    </main>
  );
}