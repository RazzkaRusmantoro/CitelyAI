'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FiSearch, FiChevronLeft, FiChevronRight, FiChevronDown, FiChevronUp, FiCopy, FiX } from 'react-icons/fi';
import Link from 'next/link';

type Paper = {
    paperId: string;
    title: string;
    abstract: string;
    url: string;
    year: number;
    citationCount: number;
    authors: Array<{
        authorId: string;
        name: string;
    }>;
    fieldsOfStudy?: string[];
    publicationDate?: string;
};

type FilterOptions = {
    sortBy: 'relevance' | 'date' | 'citationCount';
    sortOrder: 'asc' | 'desc';
    dateRange: [string, string] | null;
    selectedFields: string[];
    selectedAuthors: string[];
};

const PaperItem = ({ paper }: { paper: Paper }) => {
    const [expandedAbstract, setExpandedAbstract] = useState(false);
    const [showAllAuthors, setShowAllAuthors] = useState(false);
    const [showCitationPopup, setShowCitationPopup] = useState(false);
    const [selectedCitationStyle, setSelectedCitationStyle] = useState('APA');
    const [isCopied, setIsCopied] = useState(false);
    
    const MAX_AUTHORS = 3;
    const displayAuthors = paper.authors.slice(0, MAX_AUTHORS);
    const hasMoreAuthors = paper.authors.length > MAX_AUTHORS;
    const publicationDate = paper.publicationDate 
        ? new Date(paper.publicationDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
        : paper.year.toString();

    const abstractLines = paper.abstract?.split('\n') || [];
    const needsExpansion = abstractLines.length > 3 || 
                         (paper.abstract && paper.abstract.length > 300);

    const generateCitation = () => {
        const authorList = paper.authors.length <= 5 
            ? paper.authors.map(a => {
                const [last, first] = a.name.split(' ');
                const firstNameInitial = first ? `${first.charAt(0)}.` : '';
                
                switch(selectedCitationStyle) {
                    case 'MLA':
                    case 'Chicago':
                        return `${last}, ${first}`;
                    case 'APA':
                    case 'Harvard':
                        return `${last}, ${firstNameInitial}`;
                    default:
                        return a.name;
                }
            }).join(', ')
            : `${paper.authors[0]?.name.split(' ')[0]}, et al.`;
        
        const title = paper.title.endsWith('.') ? paper.title : `${paper.title}.`;
        const currentDate = new Date().toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        }).replace(',', '');
        
        switch(selectedCitationStyle) {
            case 'APA':
                return `${authorList} (${paper.year}). ${title} ${paper.fieldsOfStudy?.[0] || 'Journal'}.`;
            case 'MLA':
                return `${authorList}. "${title}" ${paper.fieldsOfStudy?.[0] || 'Journal'}, ${paper.publicationDate ? new Date(paper.publicationDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }).replace(',', '') : paper.year}, ${paper.url}.`;
            case 'Chicago':
                return `${authorList}. "${title}" ${paper.fieldsOfStudy?.[0] || 'Journal'}. Accessed ${currentDate}.`;
            case 'Harvard':
                return `${authorList} ${paper.year}, ${title}, ${paper.fieldsOfStudy?.[0] || 'Journal'}, viewed ${currentDate}`;
            default:
                return `${authorList} (${paper.year}). ${title}`;
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generateCitation());
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <div className="p-7 border-t border-[#D9DADB] relative">
            <h2 className="text-xl font-semibold mb-3">
                <a 
                    href={paper.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-yellow-600 hover:underline cursor-pointer"
                >
                    {paper.title}
                </a>
            </h2>

            <div className="flex flex-wrap items-center justify-between mb-3 gap-2">
                <div className="flex flex-wrap items-center gap-2">
                    {displayAuthors.map((author) => (
                        <span 
                            key={author.authorId} 
                            className="px-3 py-1 bg-white rounded-md text-sm text-gray-700 border border-gray-200 cursor-default"
                        >
                            {author.name}
                        </span>
                    ))}
                    {hasMoreAuthors && (
                        <div className="relative">
                            <button 
                                className="px-3 py-1 bg-white rounded-md text-sm text-gray-700 hover:bg-gray-100 border border-gray-200 cursor-pointer"
                                onMouseEnter={() => setShowAllAuthors(true)}
                                onMouseLeave={() => setShowAllAuthors(false)}
                            >
                                ...
                            </button>
                            {showAllAuthors && (
                                <div className="absolute z-10 mt-1 w-48 p-2 bg-white border border-gray-200 rounded-md shadow-lg">
                                    <div className="text-sm text-gray-700">
                                        {paper.authors.slice(MAX_AUTHORS).map(author => (
                                            <div key={author.authorId} className="py-1">
                                                {author.name}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <span className="text-sm text-gray-500">
                    {publicationDate}
                </span>
            </div>

            {paper.fieldsOfStudy && paper.fieldsOfStudy.length > 0 && (
                <div className="mb-3">
                    <span className="text-sm font-medium text-gray-500">
                        {paper.fieldsOfStudy.join(' • ')}
                    </span>
                </div>
            )}

            <div className="mb-2">
                <p className={`text-gray-700 ${!expandedAbstract ? 'line-clamp-3' : ''}`}>
                    {paper.abstract}
                </p>
                {needsExpansion && (
                    <button
                        onClick={() => setExpandedAbstract(!expandedAbstract)}
                        className="mt-1 text-sm text-blue-600 hover:text-blue-700 flex items-center cursor-pointer"
                    >
                        {expandedAbstract ? (
                            <>
                                <FiChevronUp className="mr-1" /> Show less
                            </>
                        ) : (
                            <>
                                <FiChevronDown className="mr-1" /> Show more
                            </>
                        )}
                    </button>
                )}
            </div>

            <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-gray-500">
                    Citations: {paper.citationCount}
                </div>
                
                <button 
                    onClick={() => setShowCitationPopup(true)}
                    className="px-4 py-2 bg-white text-gray-700 rounded-md hover:bg-gray-200 text-sm flex border border-gray-200 items-center gap-2 cursor-pointer transition-colors"
                >
                    <FiCopy size={14} /> Cite
                </button>
            </div>

            {showCitationPopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto">
                        <div className="flex justify-between items-center border-b p-4">
                            <h2 className="text-xl font-semibold">Cite Paper</h2>
                            <button 
                                onClick={() => setShowCitationPopup(false)}
                                className="p-1 rounded-full hover:bg-gray-100 cursor-pointer transition-colors"
                            >
                                <FiX size={24} />
                            </button>
                        </div>
                        
                        <div className="flex">
                            <div className="w-1/3 border-r p-4">
                                <h3 className="font-medium mb-3 text-sm text-gray-700">Citation Style</h3>
                                <ul className="space-y-1">
                                    {['APA', 'MLA', 'Chicago', 'Harvard'].map(style => (
                                        <li key={style}>
                                            <button
                                                className={`w-full text-left p-2 rounded text-sm transition-colors ${selectedCitationStyle === style ? 'bg-blue-100 text-blue-700 font-medium' : 'hover:bg-gray-50 cursor-pointer'}`}
                                                onClick={() => setSelectedCitationStyle(style)}
                                            >
                                                {style}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            
                            <div className="w-2/3 p-4">
                                <h3 className="font-medium mb-3 text-sm text-gray-700">{selectedCitationStyle} Citation</h3>
                                
                                <div className="relative">
                                    <div className="bg-gray-50 p-4 rounded text-sm font-mono whitespace-pre-wrap border border-gray-200 min-h-[150px] max-h-[200px] overflow-y-auto break-words">
                                        {generateCitation()}
                                    </div>
                                    <button
                                        onClick={copyToClipboard}
                                        className="absolute right-3 bottom-3 bg-white p-2 rounded-md border border-gray-300 hover:bg-gray-100 cursor-pointer transition-colors shadow-sm"
                                        title="Copy citation"
                                    >
                                        <FiCopy size={16} className="text-gray-600" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default function SearchResults() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const query = searchParams.get('q');
    const page = parseInt(searchParams.get('page') || '1');
    const [searchInput, setSearchInput] = useState(query || '');
    const [allResults, setAllResults] = useState<Paper[]>([]);
    const [currentPageResults, setCurrentPageResults] = useState<Paper[]>([]);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<FilterOptions>({
        sortBy: 'relevance',
        sortOrder: 'desc',
        dateRange: null,
        selectedFields: [],
        selectedAuthors: []
    });
    const [openDropdown, setOpenDropdown] = useState<'date' | 'fields' | 'authors' | 'sort' | null>(null);

    const RESULTS_PER_PAGE = 10;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (openDropdown && !(event.target as Element).closest('.dropdown-container')) {
                setOpenDropdown(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [openDropdown]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchInput.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchInput.trim())}&page=1`);
        }
    };

    const getAllFields = () => {
        const fields = new Set<string>();
        allResults.forEach(paper => {
            paper.fieldsOfStudy?.forEach(field => fields.add(field));
        });
        return Array.from(fields);
    };

    const getAllAuthors = () => {
        const authorCounts = new Map<string, number>();
        allResults.forEach(paper => {
            paper.authors.forEach(author => {
                authorCounts.set(author.name, (authorCounts.get(author.name) || 0) + 1);
            });
        });
        return Array.from(authorCounts.entries()).sort((a, b) => b[1] - a[1]);
    };

    const toggleSortOrder = () => {
        setFilters({...filters, sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc'});
    };

    const applyFiltersAndSort = (results: Paper[]) => {
        let filteredResults = [...results];
        
        if (filters.dateRange) {
            const [startDate, endDate] = filters.dateRange;
            filteredResults = filteredResults.filter(paper => {
                const paperDate = paper.publicationDate ? new Date(paper.publicationDate) : new Date(paper.year, 0, 1);
                return (!startDate || paperDate >= new Date(startDate)) && 
                       (!endDate || paperDate <= new Date(endDate));
            });
        }
        
        if (filters.selectedFields.length > 0) {
            filteredResults = filteredResults.filter(paper => 
                paper.fieldsOfStudy?.some(field => filters.selectedFields.includes(field)))
        }
        
        if (filters.selectedAuthors.length > 0) {
            filteredResults = filteredResults.filter(paper => 
                paper.authors.some(author => filters.selectedAuthors.includes(author.name)))
        }
        
        switch (filters.sortBy) {
            case 'date':
                filteredResults.sort((a, b) => {
                    const dateA = a.publicationDate ? new Date(a.publicationDate) : new Date(a.year, 0, 1);
                    const dateB = b.publicationDate ? new Date(b.publicationDate) : new Date(b.year, 0, 1);
                    return filters.sortOrder === 'asc' 
                        ? dateA.getTime() - dateB.getTime()
                        : dateB.getTime() - dateA.getTime();
                });
                break;
            case 'citationCount':
                filteredResults.sort((a, b) => 
                    filters.sortOrder === 'asc'
                        ? a.citationCount - b.citationCount
                        : b.citationCount - a.citationCount
                );
                break;
        }
        
        return filteredResults;
    };

    useEffect(() => {
        if (!query) return;
        setSearchInput(query);

        const fetchResults = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch results');
                }
                const data = await response.json();
                setAllResults(data.data || []);
            } catch (err) {
                setError('Failed to load search results');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchResults();
    }, [query]);

    useEffect(() => {
        if (allResults.length === 0) return;
        
        const filteredResults = applyFiltersAndSort(allResults);
        const totalFilteredPages = Math.ceil(filteredResults.length / RESULTS_PER_PAGE);
        setTotalPages(totalFilteredPages);
        
        const startIndex = (page - 1) * RESULTS_PER_PAGE;
        const endIndex = startIndex + RESULTS_PER_PAGE;
        setCurrentPageResults(filteredResults.slice(startIndex, endIndex));
    }, [page, allResults, filters]);

    const handlePageChange = (newPage: number) => {
        router.push(`/search?q=${encodeURIComponent(query || '')}&page=${newPage}`);
    };

    return (
        <div className="bg-[#F6F5F1] min-h-screen">
            <div className="bg-white border-b border-[#D9DADB] py-4">
                <div className="container mx-auto px-4 flex items-center justify-between">
                    <Link href="/dashboard/home" className="ml-32 text-2xl font-bold text-gray-800 transition-colors cursor-pointer">
                        Citely
                    </Link>
                    
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-full max-w-5xl">
                        <form onSubmit={handleSearch} className="w-full relative">
                            <input
                                type="text"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                className="block w-full pl-5 pr-3 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Search for academic papers, articles, or sources..."
                                disabled={isLoading}
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                <button 
                                    type="submit"
                                    className="p-1 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md cursor-pointer"
                                    aria-label="Search"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <span className="loading-spinner h-5 w-5 border-2 border-gray-400 border-t-blue-500 rounded-full animate-spin" />
                                    ) : (
                                        <FiSearch className="h-5 w-5 text-gray-400 hover:text-gray-600 cursor-pointer" />
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-40 py-4">
                <div className="rounded-lg p-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                            <div className="relative dropdown-container">
                                <button 
                                    onClick={() => setOpenDropdown(openDropdown === 'date' ? null : 'date')}
                                    className="bg-white flex items-center text-sm text-gray-700 border border-gray-300 rounded-md px-3 py-2 hover:bg-gray-50 cursor-pointer"
                                >
                                    <span>Date Range</span>
                                    <FiChevronDown className={`ml-1 transition-transform ${openDropdown === 'date' ? 'rotate-180' : ''}`} />
                                </button>
                                {openDropdown === 'date' && (
                                    <div className="absolute z-10 mt-1 bg-white border border-gray-200 rounded-md shadow-lg p-4 w-80">
                                        <div className="flex flex-col space-y-4">
                                        {/* Min / Max Labels */}
                                        <div className="flex justify-between text-sm font-medium text-gray-700">
                                            <span>
                                            {filters.dateRange?.[0]
                                                ? new Date(filters.dateRange[0]).getFullYear()
                                                : '1900'}
                                            </span>
                                            <span>
                                            {new Date().getFullYear()}
                                            </span>
                                        </div>

                                        {/* Slider */}
                                        <div className="relative h-10">
                                            {/* Track */}
                                            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 rounded-full transform -translate-y-1/2" />

                                            {/* Active Track */}
                                            {(() => {
                                            const minYear = 1900;
                                            const maxYear = new Date().getFullYear();
                                            const start = filters.dateRange?.[0]
                                                ? new Date(filters.dateRange[0]).getFullYear()
                                                : minYear;
                                            const leftPercent = ((start - minYear) / (maxYear - minYear)) * 100;

                                            return (
                                                <div
                                                className="absolute top-1/2 h-1 bg-blue-400 rounded-full transform -translate-y-1/2"
                                                style={{ left: `0%`, width: `${leftPercent}%` }}
                                                />
                                            );
                                            })()}

                                            {/* Single Range Input */}
                                            <input
                                            type="range"
                                            min={1900}
                                            max={new Date().getFullYear()}
                                            value={
                                                filters.dateRange?.[0]
                                                ? new Date(filters.dateRange[0]).getFullYear()
                                                : 1900
                                            }
                                            onChange={(e) => {
                                                const newVal = parseInt(e.target.value);
                                                setFilters({
                                                ...filters,
                                                dateRange: [`${newVal}-01-01`, `${new Date().getFullYear()}-12-31`],
                                                });
                                            }}
                                            className="absolute w-full h-1 appearance-none bg-transparent top-1/2 transform -translate-y-1/2 cursor-pointer"
                                            style={{ zIndex: 2 }}
                                            />

                                        </div>

                                        {/* Buttons */}
                                        <div className="flex justify-between pt-2">
                                            <button
                                            className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer"
                                            onClick={() => setFilters({ ...filters, dateRange: null })}
                                            >
                                            Clear
                                            </button>
                                            <button
                                            className="text-sm bg-Blue-600 text-white px-3 py-1 rounded-md hover:bg-Blue-700 cursor-pointer"
                                            onClick={() => setOpenDropdown(null)}
                                            >
                                            Apply
                                            </button>
                                        </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="relative dropdown-container">
                                <button 
                                    onClick={() => setOpenDropdown(openDropdown === 'fields' ? null : 'fields')}
                                    className="bg-white flex items-center text-sm text-gray-700 border border-gray-300 rounded-md px-3 py-2 hover:bg-gray-50 cursor-pointer"
                                >
                                    <span>Fields of Study</span>
                                    <FiChevronDown className={`ml-1 transition-transform ${openDropdown === 'fields' ? 'rotate-180' : ''}`} />
                                </button>
                                {openDropdown === 'fields' && (
                                    <div className="absolute z-10 mt-1 bg-white border border-gray-200 rounded-md shadow-lg p-2 w-64 max-h-60 overflow-y-auto">
                                        {getAllFields().map(field => (
                                            <div key={field} className="flex items-center p-1">
                                                <input
                                                    type="checkbox"
                                                    id={`field-${field}`}
                                                    checked={filters.selectedFields.includes(field)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setFilters({...filters, selectedFields: [...filters.selectedFields, field]});
                                                        } else {
                                                            setFilters({...filters, selectedFields: filters.selectedFields.filter(f => f !== field)});
                                                        }
                                                    }}
                                                    className="h-4 w-4 text-yellow-600 rounded cursor-pointer"
                                                />
                                                <label htmlFor={`field-${field}`} className="ml-2 text-sm text-gray-700 cursor-pointer">
                                                    {field}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="relative dropdown-container">
                                <button 
                                    onClick={() => setOpenDropdown(openDropdown === 'authors' ? null : 'authors')}
                                    className="bg-white flex items-center text-sm text-gray-700 border border-gray-300 rounded-md px-3 py-2 hover:bg-gray-50 cursor-pointer"
                                >
                                    <span>Authors</span>
                                    <FiChevronDown className={`ml-1 transition-transform ${openDropdown === 'authors' ? 'rotate-180' : ''}`} />
                                </button>
                                {openDropdown === 'authors' && (
                                    <div className="absolute z-10 mt-1 bg-white border border-gray-200 rounded-md shadow-lg p-2 w-64 max-h-60 overflow-y-auto">
                                        {getAllAuthors().map(([author, count]) => (
                                            <div key={author} className="flex items-center p-1">
                                                <input
                                                    type="checkbox"
                                                    id={`author-${author}`}
                                                    checked={filters.selectedAuthors.includes(author)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setFilters({...filters, selectedAuthors: [...filters.selectedAuthors, author]});
                                                        } else {
                                                            setFilters({...filters, selectedAuthors: filters.selectedAuthors.filter(a => a !== author)});
                                                        }
                                                    }}
                                                    className="h-4 w-4 text-yellow-600 rounded cursor-pointer"
                                                />
                                                <label htmlFor={`author-${author}`} className="ml-2 text-sm text-gray-700 cursor-pointer">
                                                    {author} ({count})
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {(filters.dateRange || filters.selectedFields.length > 0 || filters.selectedAuthors.length > 0) && (
                                <button 
                                    className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer"
                                    onClick={() => setFilters({
                                        sortBy: 'relevance',
                                        sortOrder: 'desc',
                                        dateRange: null,
                                        selectedFields: [],
                                        selectedAuthors: []
                                    })}
                                >
                                    Clear All
                                </button>
                            )}
                        </div>

                        <div className="flex items-center space-x-2">
                            <div className="relative dropdown-container">
                                <button 
                                    onClick={() => setOpenDropdown(openDropdown === 'sort' ? null : 'sort')}
                                    className="bg-white flex items-center text-sm text-gray-700 border border-gray-300 rounded-md px-3 py-2 hover:bg-gray-50 cursor-pointer"
                                >
                                    <span>
                                        Sort by: {
                                            filters.sortBy === 'citationCount'
                                            ? 'Citation Count'
                                            : filters.sortBy.charAt(0).toUpperCase() + filters.sortBy.slice(1)
                                        }
                                    </span>
                                    <FiChevronDown className={`ml-1 transition-transform ${openDropdown === 'sort' ? 'rotate-180' : ''}`} />
                                </button>
                                {openDropdown === 'sort' && (
                                    <div className="absolute z-10 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg p-2 w-48">
                                        {['relevance', 'date', 'citationCount'].map((option) => (
                                            <button
                                                key={option}
                                                className={`w-full text-left px-3 py-1 rounded text-sm transition-colors ${filters.sortBy === option ? 'bg-yellow-50 text-yellow-600 font-medium' : 'hover:bg-gray-50 cursor-pointer'}`}
                                                onClick={() => {
                                                    setFilters({...filters, sortBy: option as any});
                                                    setOpenDropdown(null);
                                                }}
                                            >
                                                {option === 'citationCount' ? 'Citation Count' : option.charAt(0).toUpperCase() + option.slice(1)}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            
                            {filters.sortBy !== 'relevance' && (
                                <button
                                    onClick={toggleSortOrder}
                                    className="bg-white flex items-center text-sm text-gray-700 border border-gray-300 rounded-md px-2 py-2 hover:bg-gray-50 cursor-pointer"
                                    title={filters.sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                                >
                                    {filters.sortOrder === 'asc' ? <FiChevronUp /> : <FiChevronDown />}
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                        {filters.dateRange && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {new Date(filters.dateRange[0]).getFullYear()} - {new Date(filters.dateRange[1]).getFullYear()}
                                <button 
                                    onClick={() => setFilters({...filters, dateRange: null})}
                                    className="ml-1 text-blue-500 hover:text-blue-700 cursor-pointer"
                                >
                                    ×
                                </button>
                            </span>
                        )}
                        {filters.selectedFields.map(field => (
                            <span key={field} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {field}
                                <button 
                                    onClick={() => setFilters({...filters, selectedFields: filters.selectedFields.filter(f => f !== field)})}
                                    className="ml-1 text-blue-500 hover:text-blue-700 cursor-pointer"
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                        {filters.selectedAuthors.map(author => (
                            <span key={author} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {author}
                                <button 
                                    onClick={() => setFilters({...filters, selectedAuthors: filters.selectedAuthors.filter(a => a !== author)})}
                                    className="ml-1 text-blue-500 hover:text-blue-700 cursor-pointer"
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-40 py-4">
                {isLoading && (
                    <div className="flex justify-center my-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                )}

                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
                        <p>{error}</p>
                    </div>
                )}

                {!isLoading && !error && (
                    <>
                        <div className="space-y-6">
                            {currentPageResults.length > 0 ? (
                                currentPageResults.map((paper) => (
                                    <PaperItem key={paper.paperId} paper={paper} />
                                ))
                            ) : (
                                <p className="text-gray-600"></p>
                            )}
                        </div>

                        {totalPages > 1 && (
                            <div className="flex justify-center mt-8 items-center gap-4">
                                <button
                                    onClick={() => handlePageChange(page - 1)}
                                    disabled={page === 1}
                                    className="text-yellow-600 px-4 py-2 border-2 border-yellow-600 cursor-pointer transition-all duration-300 ease-in-out rounded-none 
                                            hover:bg-yellow-600 hover:text-white hover:shadow-md hover:scale-105 disabled:hover:bg-transparent disabled:hover:text-[#155DFC]"
                                >
                                    <span className="flex items-center gap-1">
                                        <FiChevronLeft size={14} /> Prev
                                    </span>
                                </button>
                                
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => handlePageChange(1)}
                                        className={`w-10 h-10 transition-all duration-300 ease-in-out cursor-pointer 
                                                ${page === 1 ? 'bg-yellow-600 text-white' : 'text-yellow-600 hover:bg-yellow-600/10 hover:scale-105'}`}
                                    >
                                        1
                                    </button>

                                    {page > 3 && (
                                        <span className="px-2 text-yellow-600">...</span>
                                    )}

                                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                                        .filter(pageNum => {
                                            if (totalPages <= 5) return true;
                                            if (page <= 3) return pageNum > 1 && pageNum <= 5;
                                            if (page >= totalPages - 2) return pageNum >= totalPages - 4 && pageNum < totalPages;
                                            return pageNum >= page - 1 && pageNum <= page + 1;
                                        })
                                        .map(pageNum => (
                                            <button
                                                key={pageNum}
                                                onClick={() => handlePageChange(pageNum)}
                                                className={`w-10 h-10 transition-all duration-300 ease-in-out cursor-pointer 
                                                        ${page === pageNum ? 'bg-yellow-600 text-white' : 'text-yellow-600 hover:bg-yellow-600/10 hover:scale-105'}`}
                                            >
                                                {pageNum}
                                            </button>
                                        ))}

                                    {page < totalPages - 2 && totalPages > 5 && (
                                        <span className="px-2 text-yellow-600">...</span>
                                    )}

                                    {totalPages > 1 && (page <= totalPages - 3 || totalPages <= 5) && (
                                        <button
                                            onClick={() => handlePageChange(totalPages)}
                                            className={`w-10 h-10 transition-all duration-300 ease-in-out cursor-pointer 
                                                    ${page === totalPages ? 'bg-yellow-600 text-white' : 'text-yellow-600 hover:bg-yellow-600/10 hover:scale-105'}`}
                                        >
                                            {totalPages}
                                        </button>
                                    )}
                                </div>

                                <button
                                    onClick={() => handlePageChange(page + 1)}
                                    disabled={page === totalPages}
                                    className="text-yellow-600 px-4 py-2 border-2 border-yellow-600 cursor-pointer transition-all duration-300 ease-in-out rounded-none 
                                            hover:bg-yellow-600 hover:text-white hover:shadow-md hover:scale-105 disabled:hover:bg-transparent disabled:hover:text-yellow-600"
                                >
                                    <span className="flex items-center gap-1">
                                        Next <FiChevronRight size={14} />
                                    </span>
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}