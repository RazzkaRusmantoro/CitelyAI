"use client";

import { signup } from './action'

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod';
import OAuthIcoButton from "@/components/OAuthIcoButton";


const fullSchema = z.
    object({
    f_name: z.string().min(1, "Enter your first name"),
    l_name: z.string().min(1, "Enter your last name"),
    email: z.string().min(1, "Enter your email").email({ message: "Invalid email address"}),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirm_password: z.string(),
    }).refine((data) => data.password === data.confirm_password, {
        message: "Passwords must match",
        path: ['confirm_password']
    });

const registerSchema = fullSchema.transform(({ confirm_password, ...rest }) => rest);
    
type registerData = z.infer<typeof fullSchema>

export default function Register() {
    const {
      register,
      handleSubmit,
      setError,
      formState: { errors, isSubmitting },
    } = useForm<registerData>({
      resolver: zodResolver(fullSchema),
    });

    const onSubmit = async (data: registerData) => {
        const data_thing = registerSchema.parse(data);
        try {
            const formData = new FormData();
            Object.entries(data_thing).forEach(([key, value]) => {
                formData.append(key, value);
            });
            const result = await signup(formData);
            if (result?.error) {
                if (result.error == 'Email already exists') {
                    setError('email', { message: 'Email already exists'} );
                } else {
                    console.error(result.error);
                }

            }
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <main className="relative flex flex-col md:flex-row justify-center items-center min-h-screen bg-gray-50 px-4 py-8">
            <div className="w-full max-w-lg md:w-125 md:h-auto flex items-center justify-center mx-auto rounded-xl border border-gray-300 shadow-lg bg-white">
                <div className="w-full max-w-lg text-[#161616] flex flex-col items-center justify-start p-4 md:p-6 relative z-10">
                <h1 className="text-2xl md:text-3xl font-bold mb-6 mt-4 md:mt-6 text-center">
                    Sign Up an Account
                </h1>

                {/* Form Inputs */}
                <form className="w-full flex flex-col gap-3 md:gap-4" autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
                    <div className="relative w-full">
                    <input
                        type="text"
                        placeholder="First Name"
                        {...register("f_name")}
                        onFocus={(e) => e.target.removeAttribute("readOnly")}
                        className={`w-full p-2 md:p-3 pl-4 md:pl-6 rounded border ${errors.f_name ? "border-red-500" : "border-gray-300"} 
                        bg-opacity-20 text-black outline-none focus:border-[#f2c10f] placeholder:text-gray-400 appearance-none`}
                    />
                    {errors.f_name && (
                        <p className="text-red-500 text-xs md:text-sm mt-1">{errors.f_name.message}</p>
                    )}
                    </div>

                    <div className="relative w-full">
                    <input
                        type="text"
                        placeholder="Last Name"
                        {...register("l_name")}
                        onFocus={(e) => e.target.removeAttribute("readOnly")}
                        className={`w-full p-2 md:p-3 pl-4 md:pl-6 rounded border ${errors.l_name ? "border-red-500" : "border-gray-300"} 
                        bg-opacity-20 text-black outline-none focus:border-[#f2c10f] placeholder:text-gray-400 appearance-none`}
                    />
                    {errors.l_name && (
                        <p className="text-red-500 text-xs md:text-sm mt-1">{errors.l_name.message}</p>
                    )}
                    </div>

                    <div className="relative w-full">
                    <input
                        type="email"
                        placeholder="Email"
                        {...register("email")}
                        onFocus={(e) => e.target.removeAttribute("readOnly")}
                        className={`w-full p-2 md:p-3 pl-4 md:pl-6 rounded border ${errors.email ? "border-red-500" : "border-gray-300"} 
                        bg-opacity-20 text-black outline-none focus:border-[#f2c10f] placeholder:text-gray-400 appearance-none`}
                    />
                    {errors.email && (
                        <p className="text-red-500 text-xs md:text-sm mt-1">{errors.email.message}</p>
                    )}
                    </div>

                    <div className="relative w-full">
                    <input
                        type="password"
                        placeholder="Password"
                        {...register("password")}
                        className={`w-full p-2 md:p-3 pl-4 md:pl-6 rounded border ${errors.password ? "border-red-500" : "border-gray-300"}
                        bg-opacity-20 text-black outline-none focus:border-[#f2c10f] transition-all placeholder:text-gray-400 appearance-none`}
                    />
                    {errors.password && (
                        <p className="text-red-500 text-xs md:text-sm mt-1">{errors.password.message}</p>
                    )}
                    </div>

                    <div className="relative w-full">
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        {...register("confirm_password")}
                        className={`w-full p-2 md:p-3 pl-4 md:pl-6 rounded border ${errors.confirm_password ? "border-red-500" : "border-gray-300"}
                        bg-opacity-20 text-black outline-none focus:border-[#f2c10f] transition-all placeholder:text-gray-400 appearance-none`}
                    />
                    {errors.confirm_password && (
                        <p className="text-red-500 text-xs md:text-sm mt-1">{errors.confirm_password.message}</p>
                    )}
                    </div>

                    <button
                    disabled={isSubmitting}
                    className={`${isSubmitting ? "cursor-not-allowed" : "cursor-pointer"} w-full group relative inline-flex h-12 md:h-14 items-center justify-center overflow-hidden rounded-md border border-[#f2c10f] px-6 md:px-10 font-medium text-white transition-all duration-100 [box-shadow:3px_3px_rgb(186_130_9)] hover:translate-x-[3px] hover:translate-y-[3px] hover:[box-shadow:0px_0px_rgb(82_82_82)] bg-[#f2c10f] text-base md:text-lg`}
                    type="submit"
                    >
                    <b>{isSubmitting ? (
                        <span className="flex items-center">
                        <AiOutlineLoading3Quarters className="animate-spin mr-2 w-4 h-4 md:w-5 md:h-5"/>
                        Signing in
                        </span>
                    ) : "Sign up!"}</b>
                    </button>
                </form>
                
                <Link href="/login" className="text-sm md:text-base mt-4">
                    <span className="relative cursor-pointer after:block after:h-[1px] md:after:h-[2px] after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-full">
                    Already have an account?
                    </span>
                </Link>

                <div className="relative flex items-center w-full my-3 md:my-4">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="flex-shrink mx-2 md:mx-4 text-gray-500 text-xs md:text-sm">Or continue with</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>

                {/* OAuth Buttons */}
                <div className="w-full flex flex-row justify-center gap-x-3 md:gap-x-4 py-1 md:py-2">
                    <OAuthIcoButton provider="google" icon={<FcGoogle className="w-4 h-4 md:w-5 md:h-5" />} tooltip="Google" />
                    <OAuthIcoButton provider="github" icon={<FaGithub className="w-4 h-4 md:w-5 md:h-5" />} tooltip="GitHub" />
                    <OAuthIcoButton provider="twitter" icon={<FaXTwitter className="w-4 h-4 md:w-5 md:h-5" />} tooltip="X" />
                </div>
                </div>
            </div>
        </main>
    );
}
