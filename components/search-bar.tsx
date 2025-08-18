'use client';

import { FiSearch } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

interface SearchBarProps {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
}

export default function SearchBar({ searchQuery, onSearchQueryChange }: SearchBarProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = async (e: FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setIsLoading(true);
        try {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        } catch (error) {
            console.error('Search failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSearch} className="w-full max-w-7xl relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchQueryChange(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
                placeholder="Search for academic papers, articles, or sources..."
                disabled={isLoading}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <button 
                    type="submit"
                    className="p-1 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
                    aria-label="Search"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <span className="loading-spinner h-5 w-5 border-2 border-gray-400 border-t-blue-500 rounded-full animate-spin" />
                    ) : (
                        <FiSearch className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer" />
                    )}
                </button>
            </div>
        </form>
    );
}