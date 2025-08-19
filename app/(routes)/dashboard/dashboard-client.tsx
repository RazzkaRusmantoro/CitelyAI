"use client";

import { AppSidebar } from "@/components/Sidebar";
import type { User } from "@/app/auth/getUser";
import { useState, useRef, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface DashboardClientProps {
  user: User | null;
  children?: React.ReactNode;
}

export default function DashboardClient({ user, children }: DashboardClientProps) {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const menuItems = [
    { name: "Profile", description: "View your account", href: "/profile" },
    { name: "Dashboard", description: "Your main workspace", href: "/dashboard/home" },
    { name: "AI Citation Basic", description: "Simple citation generator", href: "/dashboard/ai-citation" },
    { name: "AI Citation Pro", description: "Advanced citation tools", href: "/dashboard/ai-citation-pro" },
    { name: "Academic Citer", description: "Academic references", href: "/dashboard/custom-link-citation" },
    { name: "Bibliography Manager", description: "Organize your sources", href: "/dashboard/bibliography-manager" },
    { name: "Academic Source Finder", description: "Discover research papers", href: "/dashboard/academic-source-finder" },
    { name: "Paper Summary", description: "Summarize documents", href: "/dashboard/paper-summarizer" },
    { name: "Source Credibility", description: "Evaluate source quality", href: "/dashboard/source-credibility-checker" },
    { name: "Pricing", description: "Plans & features", href: "/pricing" }
  ];

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return menuItems;
    
    const query = searchQuery.toLowerCase();
    return menuItems.filter(item => 
      item.name.toLowerCase().includes(query) || 
      item.description.toLowerCase().includes(query)
    );
  }, [searchQuery, menuItems]);

  const handleBlur = (e: React.FocusEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.relatedTarget as Node)) {
      setIsSearchFocused(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim() && filteredItems.length > 0) {
      e.preventDefault();
      router.push(filteredItems[0].href);
      setIsSearchFocused(false);
      setSearchQuery("");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="flex h-screen relative bg-gradient-to-b from-white to-gray-50">
      
      <AppSidebar user={user} />
      
      <div className="flex-1 overflow-auto pl-20">
        <nav className="bg-transparent px-6 py-4">
          <div className="max-w-315 mx-auto flex items-center justify-between">
            <div className="w-[85%] md:justify-start">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  ref={inputRef}
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={handleBlur}
                  onKeyDown={handleKeyDown}
                />
                {isSearchFocused && (
                  <div 
                    ref={dropdownRef}
                    className="absolute z-[9999] mt-2 w-full bg-white shadow-lg rounded-md border border-gray-200 py-1 max-h-96 overflow-y-auto"
                  >
                    <div className="px-4 py-2 sticky top-0 bg-white">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                        {searchQuery.trim() ? "SEARCH RESULTS" : "SUGGESTED"}
                      </span>
                    </div>
                    <div className="space-y-1 px-2 pb-2">
                      {filteredItems.length > 0 ? (
                        filteredItems.map((item, index) => (
                          <Link
                            key={index}
                            href={item.href}
                            className="w-full px-3 py-1 text-left text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors duration-150 flex items-center justify-between cursor-pointer block"
                            onClick={() => {
                              setIsSearchFocused(false);
                              setSearchQuery("");
                            }}
                          >
                            <span>{item.name}</span>
                            <span className="text-xs text-gray-400">{item.description}</span>
                          </Link>
                        ))
                      ) : (
                        <div className="px-3 py-2 text-sm text-gray-500">
                          No results found for "{searchQuery}"
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 flex justify-center md:justify-end">
              <div className="flex items-center space-x-4">
                <button className="text-gray-500 hover:text-gray-700 p-1">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </button>
                <button className="text-gray-500 hover:text-gray-700 p-1">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  </svg>
                </button>
                <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-gray-600 text-sm">P</span>
                </div>
              </div>
            </div>
          </div>
        </nav>
        {children}
      </div>
    </div>
  );
}