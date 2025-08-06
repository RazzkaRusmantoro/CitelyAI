import { useState, useEffect } from 'react';
import { FiSearch, FiChevronDown, FiChevronUp, FiCopy, FiX, FiBookmark, FiCheck } from 'react-icons/fi';
import { getUser } from '@/app/auth/getUser';

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

const PaperItem = ({ paper }: { paper: Paper }) => {
    const [expandedAbstract, setExpandedAbstract] = useState(false);
    const [showAllAuthors, setShowAllAuthors] = useState(false);
    const [showCitationPopup, setShowCitationPopup] = useState(false);
    const [selectedCitationStyle, setSelectedCitationStyle] = useState('APA');
    const [isCopied, setIsCopied] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    
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

    useEffect(() => {
        const checkSavedStatus = async () => {
            const user = await getUser();
            setUserId(user?.id || null);
            
            if (user?.id) {
                try {
                    const response = await fetch('/api/check-saved', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            userId: user.id,
                            paperId: paper.paperId
                        }),
                    });
                    
                    if (response.ok) {
                        const data = await response.json();
                        setIsSaved(data.isSaved);
                    }
                } catch (error) {
                    console.error('Error checking saved status:', error);
                }
            }
        };
        
        checkSavedStatus();
    }, [paper.paperId]);


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

    const handleSavePaper = async () => {
        try {
            const response = await fetch('/api/save-reference', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    paperId: paper.paperId,
                    title: paper.title,
                    authors: paper.authors,
                    abstract: paper.abstract,
                    year: paper.year,
                    url: paper.url
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to save reference');
            }

            const data = await response.json();
            console.log('Reference saved:', data);
        } catch (error) {
            console.error('Error saving reference:', error);
        }
    };

    const toggleSavePaper = async () => {
        if (!userId) return;
        
        const newSavedState = !isSaved;
        setIsSaved(newSavedState);
        
        try {
            if (newSavedState) {
                const response = await fetch('/api/save-reference', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        paperId: paper.paperId,
                        title: paper.title,
                        authors: paper.authors,
                        abstract: paper.abstract,
                        year: paper.year,
                        url: paper.url
                    }),
                });
                
                if (!response.ok) {
                    setIsSaved(!newSavedState);
                    throw new Error('Failed to save reference');
                }
            } else {
                const response = await fetch('/api/delete', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId,
                        referenceId: paper.paperId
                    }),
                });
                
                if (!response.ok) {
                    setIsSaved(!newSavedState);
                    throw new Error('Failed to delete reference');
                }
            }
        } catch (error) {
            console.error('Error toggling save:', error);
        }
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
                
                <div className="flex gap-2">
                    <button 
                        onClick={toggleSavePaper}
                        disabled={isLoading || !userId}
                        className={`px-4 py-2 rounded-md text-sm flex border items-center gap-2 cursor-pointer transition-colors ${
                            isSaved 
                                ? 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200'
                                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-200'
                        }`}
                    >
                        {isLoading ? (
                            <span className="loading-spinner h-4 w-4 border-2 border-gray-400 border-t-blue-500 rounded-full animate-spin" />
                        ) : isSaved ? (
                            <>
                                <FiCheck size={14} /> Saved
                            </>
                        ) : (
                            <>
                                <FiBookmark size={14} /> Save
                            </>
                        )}
                    </button>
                    
                    <button 
                        onClick={() => setShowCitationPopup(true)}
                        className="px-4 py-2 bg-white text-gray-700 rounded-md hover:bg-gray-200 text-sm flex border border-gray-200 items-center gap-2 cursor-pointer transition-colors"
                    >
                        <FiCopy size={14} /> Cite
                    </button>
                </div>
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

export default PaperItem;