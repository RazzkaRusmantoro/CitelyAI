"use client";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import Link from "next/link";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import OAuthIcoButton from "@/components/OAuthIcoButton";


export default function Login() {
    return (
        <main className="relative flex flex-col md:flex-row justify-center items-center min-h-screen bg-gray-50 px-4">

            <div className="w-125 h-150 flex items-center justify-center mx-auto rounded-xl border border-gray-300 shadow-lg">

                <div className="w-full max-w-lg text-[#161616] flex flex-col items-center justify-start p-6 relative z-10">
                    <h1 className="text-3xl md:text-3xl font-bold mb-4 mt-6 md:mt-10 text-center">
                      Log in to Account
                    </h1>

                  <span className="mb-3 mt-2 text-sm md:text-base text-center">or use your email for signing in:</span>

                  {/* Form Inputs */}
                  <form className="w-full md:w-[100%] flex flex-col gap-4" autoComplete="off">
                      <div className="relative w-full">
                          
                          <input
                              type="email"
                              placeholder="Email"
                              autoComplete="off"
                              readOnly
                              id = "email"
                              name = "email"
                              onFocus={(e) => e.target.removeAttribute("readOnly")}
                              className="w-full p-3 pl-6 rounded border border-gray-300 bg-opacity-20 text-black outline-none focus:border-black placeholder:text-gray appearance-none"
                          />
                      </div>

                      <div className="relative w-full">
                          <input
                              type="password"
                              placeholder="Password"
                              autoComplete="new-password"
                              readOnly
                              id = "password"
                              name = "password"
                              onFocus={(e) => e.target.removeAttribute("readOnly")}
                              className="w-full p-3 pl-6 rounded border border-gray-300 bg-white bg-opacity-20 text-black outline-none focus:border-black placeholder:text-gray appearance-none"
                          />
                      </div>

                      <button 
                          className="cursor-pointer w-full md:w-[80%] mx-auto group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-md border border-[#f2c10f] px-10 font-medium text-white transition-all duration-100 [box-shadow:5px_5px_rgb(186_130_9)] hover:translate-x-[3px] hover:translate-y-[3px] hover:[box-shadow:0px_0px_rgb(82_82_82)] bg-[#f2c10f]  text-lg"
                          type="submit"
                      >
                          <b>Sign in!</b>
                      </button>
                  </form>
                  <Link href ="/register" className = "text-base mt-5">
                      <span className="mt-5 relative cursor-pointer after:block mb-15 after:h-[2px] after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-full">
                          Don't have an account?
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
