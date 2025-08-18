"use client";

import { useState } from 'react';
import { IconSearch, IconInfoCircle, IconChecklist, IconStar, IconWriting, IconScale, IconBulb } from '@tabler/icons-react';

type CredibilityBreakdown = {
  factual_accuracy: number;
  source_reputation: number;
  author_expertise: number;
  content_bias: number;
  transparency: number;
  [key: string]: number; 
};

type AnalysisResults = {
  overall_score: number;
  summary: string;
  breakdown: CredibilityBreakdown;
  warnings: string[];
  recommendations: string[];
  domain?: string;
};

export default function DashboardCredibility() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState<AnalysisResults | null>(null);

  const handleUrlSubmit = async () => {
    if (!url) {
      setError('Please enter a URL');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      setResults(null);
      
      const response = await fetch('http://localhost:5000/api/source_checker', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setResults(data.analysis);
      
    } catch (err) {
      console.error('Error checking URL:', err);
      setError('Failed to check URL. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleUrlSubmit();
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getBackgroundColor = (score: number) => {
    if (score >= 80) return 'bg-green-600';
    if (score >= 60) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  const getRingColor = (score: number) => {
    if (score >= 80) return 'ring-green-500';
    if (score >= 60) return 'ring-yellow-500';
    return 'ring-red-500';
  };

  return (
    <main className="min-h-screen w-full bg-white dark:bg-gray-900">
      <div className="w-full max-w-7xl mx-auto px-4 py-10">
        <div className="space-y-8"> 
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-black dark:text-white">
              Source Credibility Checker
            </h1>
            <p className="text-xl md:text-2xl font-medium text-gray-800 dark:text-gray-300">
              Analyze the Reliability and Factual Accuracy of Any Source
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              Check Source Credibility
            </h2>
            
            <div className="relative">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="https://www.mayoclinic.org/diseases-conditions/food-poisoning/symptoms-causes/syc-20356230"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white pr-12"
                disabled={isLoading}
              />
              <button
                onClick={handleUrlSubmit}
                disabled={isLoading}
                className={`hover:cursor-pointer absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                  isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                }`}
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <IconSearch className="h-5 w-5" strokeWidth={2} />
                )}
              </button>
            </div>

            {error && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {error}
              </p>
            )}
            
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
              Enter a URL to analyze its credibility based on multiple factors.
            </p>
          </div>

          {/* Results Section */}
          {results && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
                Credibility Analysis Results
              </h2>
              
              {/* Score and Summary Section */}
              <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
                {/* Score Circle */}
                <div className="flex flex-col items-center">
                  <div className={`relative w-32 h-32 rounded-full flex items-center justify-center 
                    ring-8 ${getRingColor(results.overall_score)}`}>
                    <span className={`text-4xl font-bold ${getScoreColor(results.overall_score)}`}>
                      {results.overall_score}
                    </span>
                  </div>
                  <p className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300">
                    Overall Credibility Score
                  </p>
                  <p className="text-center text-gray-600 dark:text-gray-400">
                    {results.summary}
                  </p>
                </div>
              </div>
              
              {/* Metrics Section */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
                  Credibility Metrics Breakdown
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(results.breakdown).map(([metric, score]) => (
                    <div key={metric} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="capitalize font-medium text-gray-800 dark:text-gray-200">
                          {metric.replace('_', ' ')}
                        </span>
                        <span className={`font-bold ${getScoreColor(score as number)}`}>
                          {score}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                        <div 
                          className={`h-2.5 rounded-full ${getBackgroundColor(score as number)}`}
                          style={{ width: `${score}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Warnings and Recommendations Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Warnings */}
                <div className="bg-red-50 dark:bg-gray-700 rounded-lg p-4 border border-red-100 dark:border-gray-600">
                  <div className="flex items-center mb-3">
                    <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full mr-2">
                      <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                      Warnings
                    </h3>
                  </div>
                  {results.warnings.length > 0 ? (
                    <ul className="space-y-2">
                      {results.warnings.map((warning: string, i: number) => (
                        <li key={i} className="flex items-start">
                          <span className="flex-shrink-0 mt-1 mr-2 text-red-500">•</span>
                          <span className="text-gray-700 dark:text-gray-300">{warning}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-700 dark:text-gray-300">No warnings detected</p>
                  )}
                </div>
                
                {/* Recommendations */}
                <div className="bg-green-50 dark:bg-gray-700 rounded-lg p-4 border border-green-100 dark:border-gray-600">
                  <div className="flex items-center mb-3">
                    <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full mr-2">
                      <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                      Recommendations
                    </h3>
                  </div>
                  {results.recommendations.length > 0 ? (
                    <ul className="space-y-2">
                      {results.recommendations.map((rec: string, i: number) => (
                        <li key={i} className="flex items-start">
                          <span className="flex-shrink-0 mt-1 mr-2 text-green-500">•</span>
                          <span className="text-gray-700 dark:text-gray-300">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-700 dark:text-gray-300">No recommendations</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* How it works section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-amber-400 to-orange-500 p-2 rounded-full mr-3">
                <IconInfoCircle className="h-5 w-5 text-white" strokeWidth={1.5} />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                How Our Source Credibility Checker Works
              </h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start p-4 hover:bg-amber-50 dark:hover:bg-amber-900/10 rounded-lg transition-colors">
                <div className="bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 p-3 rounded-full mr-4 flex-shrink-0">
                  <IconChecklist className="h-5 w-5 text-amber-600 dark:text-amber-400" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-medium text-lg text-gray-800 dark:text-gray-200 mb-2">Factual Accuracy</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    We analyze content for factual claims and cross-reference them with established knowledge bases and trusted sources.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start p-4 hover:bg-amber-50 dark:hover:bg-amber-900/10 rounded-lg transition-colors">
                <div className="bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 p-3 rounded-full mr-4 flex-shrink-0">
                  <IconStar className="h-5 w-5 text-amber-600 dark:text-amber-400" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-medium text-lg text-gray-800 dark:text-gray-200 mb-2">Source Reputation</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    We evaluate the historical reliability and reputation of the publication or domain based on expert assessments.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start p-4 hover:bg-amber-50 dark:hover:bg-amber-900/10 rounded-lg transition-colors">
                <div className="bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 p-3 rounded-full mr-4 flex-shrink-0">
                  <IconWriting className="h-5 w-5 text-amber-600 dark:text-amber-400" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-medium text-lg text-gray-800 dark:text-gray-200 mb-2">Content Analysis</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Our algorithm examines writing style, tone, and presentation for signs of sensationalism or misleading content.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start p-4 hover:bg-amber-50 dark:hover:bg-amber-900/10 rounded-lg transition-colors">
                <div className="bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 p-3 rounded-full mr-4 flex-shrink-0">
                  <IconScale className="h-5 w-5 text-amber-600 dark:text-amber-400" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-medium text-lg text-gray-800 dark:text-gray-200 mb-2">Bias Detection</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    We identify potential political, commercial, or ideological biases that might affect the objectivity of information.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-lg">
              <div className="flex items-center">
                <IconBulb className="h-5 w-5 text-amber-500 dark:text-amber-400 mr-2" strokeWidth={1.5} />
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Remember:</span> No automated tool is perfect. Always use critical thinking and consult multiple sources.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}