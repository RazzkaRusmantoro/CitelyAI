"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getUser, User } from '@/app/auth/getUser';
import { logout } from '@/app/auth/logout';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getUser();
      setUser(userData);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAuthClick = async () => {
    if (user) {
      await logout();
    }
  };
  
  return (
    
    <nav className={`flex justify-between items-center px-4 py-3 bg-white border sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'shadow-md' : ''}`}>
      {/* Logo and Desktop Navigation */}
      <div className="flex items-center">
        {/* Logo */}
        <div className="text-2xl md:text-3xl font-semibold text-black md:ml-4 lg:ml-10">Citely</div>

        {/* Desktop Navigation Links - Hidden on mobile */}
        <div className="hidden md:flex gap-4 lg:gap-6 px-4 lg:px-20">
          <button className="text-black cursor-pointer hover:text-orange-500 transition-colors ease-in-out font-bold px-3 lg:px-5 py-2">AI Tools</button>
          <button className="text-black cursor-pointer hover:text-orange-500 transition-colors ease-in-out font-bold px-3 lg:px-5 py-2">BackRoams</button>
          <button className="text-black cursor-pointer hover:text-orange-500 transition-colors ease-in-out font-bold px-3 lg:px-5 py-2">Pricing</button>
        </div>
      </div>

      {/* Desktop Buttons - Hidden on mobile */}
      <div className="hidden md:flex gap-2 lg:gap-4">
        <Link href="/login" className="text-base">
          <button onClick={handleAuthClick} className="text-black cursor-pointer hover:text-orange-500 transition-colors ease-in-out font-bold px-3 lg:px-5 py-2"> {user ? 'Log Out' : 'Log In'} </button>
        </Link>
        <Link href="/dashboard/home" className="group relative px-4 lg:px-7 py-2 lg:py-3 cursor-pointer rounded-lg bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600 text-black font-bold tracking-wider text-sm hover:from-yellow-500 hover:via-amber-600 hover:to-yellow-700 transform hover:rotate-1 transition-all duration-300 ease-out shadow-[0_0_20px_rgba(251,191,36,0.5)] hover:shadow-[0_0_30px_rgba(251,191,36,0.7)] active:scale-90 overflow-hidden before:absolute before:inset-0 before:rounded-lg before:border-2 before:border-amber-400/50 before:transition-all before:duration-300 hover:before:border-amber-300 hover:before:scale-105">
          <span className="flex items-center gap-2 relative z-10 text-white">
            Get Started
            <svg
              viewBox="0 0 24 24"
              stroke="currentColor"
              fill="none"
              className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-2"
            >
              <path
                d="M5 12h14m-7-7l7 7-7 7"
                strokeWidth="2.5"
                strokeLinejoin="round"
                strokeLinecap="round"
              ></path>
            </svg>
          </span>
          <div className="absolute inset-0 rounded-lg opacity-50 group-hover:opacity-80 transition-opacity duration-300 bg-gradient-to-tl from-amber-200/40 via-transparent to-transparent"></div>
          <div className="absolute -left-full top-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-[200%] transition-transform duration-700 ease-out"></div>
        </Link>
      </div>

      {/* Mobile Menu Button - Visible only on mobile */}
      <button 
        className="md:hidden p-2 text-black hover:text-orange-500 focus:outline-none"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isMobileMenuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile Menu - Visible only on mobile when toggled */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t shadow-lg py-4 px-6">
          <div className="flex flex-col gap-4">
            <button className="text-black cursor-pointer hover:text-orange-500 transition-colors ease-in-out font-bold py-2 text-left">AI Tools</button>
            <button className="text-black cursor-pointer hover:text-orange-500 transition-colors ease-in-out font-bold py-2 text-left">BackRoams</button>
            <button className="text-black cursor-pointer hover:text-orange-500 transition-colors ease-in-out font-bold py-2 text-left">Pricing</button>
            
            <div className="border-t border-gray-200 my-2"></div>
            
            <button className="text-black cursor-pointer hover:text-orange-500 transition-colors ease-in-out font-bold py-2 text-left">Log in</button>
            <Link href="/dashboard" className="group relative w-full py-3 cursor-pointer rounded-lg bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600 text-black font-bold tracking-wider text-sm hover:from-yellow-500 hover:via-amber-600 hover:to-yellow-700 transition-all duration-300 ease-out shadow-[0_0_20px_rgba(251,191,36,0.5)] hover:shadow-[0_0_30px_rgba(251,191,36,0.7)] active:scale-90 overflow-hidden before:absolute before:inset-0 before:rounded-lg before:border-2 before:border-amber-400/50 before:transition-all before:duration-300 hover:before:border-amber-300 hover:before:scale-105">
              <span className="flex items-center justify-center gap-2 relative z-10 text-white">
                Get Started
                <svg
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  fill="none"
                  className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-2"
                >
                  <path
                    d="M5 12h14m-7-7l7 7-7 7"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  ></path>
                </svg>
              </span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;