"use client";


import Link from "next/link";

export default function Login() {
    return (
        <main className="relative flex flex-col md:flex-row py-12">

            <div className="w-125 h-150 flex items-center justify-center mx-auto rounded-xl border border-gray-300 shadow-lg">

                <div className="w-full max-w-lg text-[#161616] flex flex-col items-center justify-start p-6 relative z-10">
                    <h1 className="text-3xl md:text-3xl font-bold mb-4 mt-6 md:mt-10 text-center">
                      Log in to Account
                    </h1>

                    {/* OAuth Buttons */}

                  <div className="w-full flex flex-col gap-y-1 py-2">
                    <button
                      className="relative md:w-full flex items-center justify-center border border-gray-300 cursor-pointer text-black bg-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-zinc-300 transition-all ease-in duration-200"
                    >
                      <div className="absolute left-4">
                        <svg
                          viewBox="0 0 48 48"
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-6 h-6"
                        >
                          <path
                            d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                            fill="#FFC107"
                          />
                          <path
                            d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                            fill="#FF3D00"
                          />
                          <path
                            d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                            fill="#4CAF50"
                          />
                          <path
                            d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                            fill="#1976D2"
                          />
                        </svg>
                      </div>

                      <span className="mx-auto">Continue with Google</span>
                    </button>

                    <button
                      className="relative md:w-full flex items-center justify-center border border-gray-300 cursor-pointer text-black bg-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-zinc-300 transition-all ease-in duration-200"
                    >
                      <div className="absolute left-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className = "w-6 h-6">
                          <path d="M10.9,2.1c-4.6,0.5-8.3,4.2-8.8,8.7c-0.5,4.7,2.2,8.9,6.3,10.5C8.7,21.4,9,21.2,9,20.8v-1.6c0,0-0.4,0.1-0.9,0.1 c-1.4,0-2-1.2-2.1-1.9c-0.1-0.4-0.3-0.7-0.6-1C5.1,16.3,5,16.3,5,16.2C5,16,5.3,16,5.4,16c0.6,0,1.1,0.7,1.3,1c0.5,0.8,1.1,1,1.4,1 c0.4,0,0.7-0.1,0.9-0.2c0.1-0.7,0.4-1.4,1-1.8c-2.3-0.5-4-1.8-4-4c0-1.1,0.5-2.2,1.2-3C7.1,8.8,7,8.3,7,7.6C7,7.2,7,6.6,7.3,6 c0,0,1.4,0,2.8,1.3C10.6,7.1,11.3,7,12,7s1.4,0.1,2,0.3C15.3,6,16.8,6,16.8,6C17,6.6,17,7.2,17,7.6c0,0.8-0.1,1.2-0.2,1.4 c0.7,0.8,1.2,1.8,1.2,3c0,2.2-1.7,3.5-4,4c0.6,0.5,1,1.4,1,2.3v2.6c0,0.3,0.3,0.6,0.7,0.5c3.7-1.5,6.3-5.1,6.3-9.3 C22,6.1,16.9,1.4,10.9,2.1z"></path>
                        </svg>
                      </div>

                      <span className="mx-auto">Continue with GitHub</span>
                    </button>

                    <button
                      className="relative md:w-full flex items-center justify-center border border-gray-300 cursor-pointer text-black bg-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-zinc-300 transition-all ease-in duration-200"
                    >
                      {/* Wrapper for SVG icon */}
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-6 h-6"
                          viewBox="0 0 48 48"
                        >
                          <linearGradient
                            id="Ld6sqrtcxMyckEl6xeDdMa_uLWV5A9vXIPu_gr1"
                            x1="9.993"
                            x2="40.615"
                            y1="9.993"
                            y2="40.615"
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop offset="0" stopColor="#2aa4f4" />
                            <stop offset="1" stopColor="#007ad9" />
                          </linearGradient>
                          <path
                            fill="url(#Ld6sqrtcxMyckEl6xeDdMa_uLWV5A9vXIPu_gr1)"
                            d="M24,4C12.954,4,4,12.954,4,24s8.954,20,20,20s20-8.954,20-20S35.046,4,24,4z"
                          />
                          <path
                            fill="#fff"
                            d="M26.707,29.301h5.176l0.813-5.258h-5.989v-2.874c0-2.184,0.714-4.121,2.757-4.121h3.283V12.46 c-0.577-0.078-1.797-0.248-4.102-0.248c-4.814,0-7.636,2.542-7.636,8.334v3.498H16.06v5.258h4.948v14.452 C21.988,43.9,22.981,44,24,44c0.921,0,1.82-0.084,2.707-0.204V29.301z"
                          />
                        </svg>
                      </div>

                      {/* Centered text */}
                      <span className="mx-auto">Continue with Facebook</span>
                    </button>

                  </div>
                
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
                          className="cursor-pointer w-full md:w-[80%] mx-auto group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-md border border-[#f2c10f] px-10 font-medium text-white transition-all duration-100 [box-shadow:5px_5px_rgb(186_130_9)] hover:translate-x-[3px] hover:translate-y-[3px] hover:[box-shadow:0px_0px_rgb(82_82_82)] bg-[#f2c10f] mt-7 text-lg"
                          type="submit"
                      >
                          <b>Sign in!</b>
                      </button>
                  </form>
                  <Link href ="/register" className = "text-base mt-5">
                      <span className="mt-5 relative cursor-pointer after:block after:h-[2px] after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-full">
                          Don't have an account?
                      </span>
                  </Link>
                </div>
            </div>
        </main>
    );
}