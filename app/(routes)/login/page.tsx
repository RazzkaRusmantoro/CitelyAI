"use client";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod';
import OAuthIcoButton from "@/components/OAuthIcoButton";
import { useState, useEffect } from "react";

const loginSchema = z.object({
  email: z.string().min(1, "Enter your email").email({ message: "Invalid email address"}),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type loginData = z.infer<typeof loginSchema>

export default function Login() {
    const [needsVerification, setNeedsVerification] = useState(false);
    const [verificationEmail, setVerificationEmail] = useState("");
    const [verificationSent, setVerificationSent] = useState(false);
    const [cooldown, setCooldown] = useState(0);
    
    const {
      register,
      handleSubmit,
      setError,
      formState: { errors, isSubmitting },
    } = useForm<loginData>({
      resolver: zodResolver(loginSchema),
    });

    // Countdown timer effect
    useEffect(() => {
      let interval: NodeJS.Timeout;
      
      if (cooldown > 0) {
        interval = setInterval(() => {
          setCooldown(prev => prev - 1);
        }, 1000);
      }
      
      return () => clearInterval(interval);
    }, [cooldown]);

    const resendVerification = async () => {
      try {
        const response = await fetch('/api/resend-verification', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: verificationEmail }),
        });

        const result = await response.json();
        
        if (result?.error) {
          setError('root', { message: 'Failed to resend verification email' });
        } else {
          setVerificationSent(true);
          setCooldown(60); // Start 60 second cooldown
        }
      } catch (error) {
        console.error('Resend verification error:', error);
        setError('root', { message: 'Failed to resend verification email' });
      }
    }

    const onSubmit = async (data: loginData) => {
      // Prevent form submission during cooldown
      if (cooldown > 0) {
        return;
      }

      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
          credentials: 'include'
        });

        const result = await response.json();

        console.log("This is the data", result)
        
        if (result?.error) {
          if (result.error === 'Invalid login credentials') {
            setError('password', { message: 'Incorrect password' });
          } else if (result.error === 'Email not found') {
            setError('email', { message: 'Email does not exist' });
          } else if (result.error === 'Email not verified') {
            setNeedsVerification(true);
            setVerificationEmail(data.email);
            setCooldown(60); // Start 60 second cooldown when email is not verified
          } else {
            setError('root', { message: result.error || 'An unexpected error occurred' });
          }
        } else {
          // Force a full page reload to ensure middleware runs
          window.location.href = '/dashboard/home';
        }

      } catch (error) {
        console.error('Login error:', error);
        setError('root', { message: 'Network error occurred' });
      }
    }

    return (
        <main className="relative flex flex-col md:flex-row justify-center items-center min-h-screen bg-gray-50 px-4">

            <div className="w-125 h-150 flex items-center justify-center mx-auto rounded-xl border border-gray-300 shadow-lg">

                <div className="w-full max-w-lg text-[#161616] flex flex-col items-center justify-start p-6 relative z-10">
                    <h1 className="relative bottom-7 text-3xl md:text-3xl font-bold mb-4 mt-6 md:mt-10 text-center">
                      Log in to Account 
                    </h1>

                  {/* Form Inputs */}
                  <form className="w-full md:w-[100%] flex flex-col gap-4" autoComplete="off"
                    onSubmit={handleSubmit(onSubmit)}>
                      <div className="relative w-full">
                          <input
                              type="email"
                              placeholder="Email"
                              {...register("email")}
                              onFocus={(e) => e.target.removeAttribute("readOnly")}
                              className={`w-full p-3 pl-6 rounded border ${errors.email ? "border-red-500" : "border-gray-300"} 
                                bg-opacity-20 text-black outline-none focus:border-[#f2c10f] placeholder:text-gray appearance-none`}
                          />
                          {errors.email && (
                            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                          )}
                      </div>

                      <div className="relative w-full">
                          <input
                              type="password"
                              placeholder="Password"
                              {...register("password")}
                              className={`w-full p-3 pl-6 rounded border ${ errors.password ? "border-red-500" : "border-gray-300" }
                                bg-opacity-20 text-black outline-none focus:border-[#f2c10f] transition-all placeholder:text-gray appearance-none`}
                          />
                          {errors.password && (
                            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                          )}

                          
                      </div>

                      {/* Email verification notice */}
                      {needsVerification && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                          <p className="font-medium">Email verification required</p>
                          <p>Please check your inbox for a verification email.</p>
                        </div>
                      )}

                      {errors.root && (
                        <p className="text-red-500 text-sm mt-1">{errors.root.message}</p>
                      )}

                      <button
                          disabled={isSubmitting || cooldown > 0}
                          className={`${
                            isSubmitting || cooldown > 0 
                              ? "cursor-not-allowed opacity-70" 
                              : "cursor-pointer"
                          } w-full md:w-[80%] mx-auto group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-md border border-[#f2c10f] px-10 font-medium text-white transition-all duration-100 [box-shadow:5px_5px_rgb(186_130_9)] hover:translate-x-[3px] hover:translate-y-[3px] hover:[box-shadow:0px_0px_rgb(82_82_82)] bg-[#f2c10f] text-lg`}
                          type="submit"
                      >
                          <b>
                            {isSubmitting ? (
                              <span className="flex items-center">
                                <AiOutlineLoading3Quarters className="animate-spin mr-2 w-5 h-5"/>
                                Signing in
                              </span>
                            ) : cooldown > 0 ? (
                              `Try again in ${cooldown}s`
                            ) : (
                              "Sign in!"
                            )}
                          </b>
                      </button>
                  </form>
                  <Link href ="/register" className = "text-base mt-5">
                      <span className="mt-5 relative cursor-pointer after:block mb-0 after:h-[2px] after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-full">
                          Don't have an account?
                      </span>
                  </Link>

                  <Link href ="/forgot-password" className = "text-sm mt-1">
                      <span className="mt-5 relative cursor-pointer after:block mb-0 after:transition-all after:duration-300 hover:after:w-full text-gray-600">
                          Forgot password?
                      </span>
                  </Link>


                  <div className="relative flex items-center w-full my-4">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="flex-shrink mx-4 text-gray-500 text-sm">Or continue with</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                  </div>

                  {/* OAuth Buttons */}

                  <div className="w-full flex flex-row justify-center gap-x-4 py-2">
                    <OAuthIcoButton provider="google" icon={<FcGoogle className="w-5 h-5" />} tooltip="Google" />
                    <OAuthIcoButton provider="github" icon={<FaGithub className="w-5 h-5" />} tooltip="GitHub" />
                    <OAuthIcoButton provider="twitter" icon={<FaXTwitter className="w-5 h-5" />} tooltip="X" />
                  </div>
                </div>
            </div>
        </main>
    );
}