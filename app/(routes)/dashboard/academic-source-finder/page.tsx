'use client';

import UploadBox from '@/components/upload-source';
import SearchBar from '@/components/search-bar';
import { useState } from 'react';
import { 
  IconCpu,
  IconRobot,
  IconBinary,
  IconCurrencyBitcoin,
  IconChartLine,
  IconBulb
} from '@tabler/icons-react';


export default function DashboardCitation() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleTopicClick = (topicTitle: string) => {
    setSearchQuery(topicTitle);
  };

  const trendingTopics = [
    {
      title: "LLM Safety & Alignment",
      field: "AI Research",
      growth: "68%",
      icon: <IconRobot className="h-5 w-5 text-amber-500" strokeWidth={1.5} />
    },
    {
      title: "Decentralized AI Systems",
      field: "Blockchain/AI",
      growth: "55%",
      icon: <IconCpu className="h-5 w-5 text-orange-500" strokeWidth={1.5} />
    },
    {
      title: "Bitcoin Layer 2 Solutions",
      field: "Cryptocurrency",
      growth: "48%",
      icon: <IconCurrencyBitcoin className="h-5 w-5 text-yellow-500" strokeWidth={1.5} />
    },
    {
      title: "Quantum Machine Learning",
      field: "Quantum Computing",
      growth: "42%",
      icon: <IconBinary className="h-5 w-5 text-amber-400" strokeWidth={1.5} />
    }
  ];

  return (
    <main className="min-h-full w-full">
      <div className="w-full flex flex-col items-center">
        <div className="relative top-10 w-full max-w-7xl px-4 space-y-6">
          <div className="">
            <h1 className="text-3xl md:text-4xl font-bold text-black dark:text-white">
              Relevant Academic Source Research Tool
            </h1>
            <p className="text-xl md:text-2xl font-medium text-gray-800 dark:text-gray-300">
              Powered By Advanced AI
            </p>
          </div>
          
          {/* Upload Box*/}
          <div className="flex justify-center">
            <UploadBox/>
          </div>

          {/* Search Bar */}
          <div className="flex justify-center">
            <SearchBar searchQuery={searchQuery} onSearchQueryChange={setSearchQuery}/>
          </div>

          {/* Research Spotlight Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-amber-400 to-orange-500 p-2 rounded-full mr-3">
                <IconChartLine className="h-5 w-5 text-white" strokeWidth={1.5} />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Emerging Research Trends
              </h2>
              <span className="ml-auto text-sm bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 px-3 py-1 rounded-full">
                Hot this week
              </span>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {trendingTopics.map((topic, index) => (
                <div 
                  key={index} 
                  className="flex items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors border border-gray-100 dark:border-gray-700 cursor-pointer"
                  onClick={() => handleTopicClick(topic.title)}
                >
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-3 rounded-full mr-4">
                    {topic.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800 dark:text-gray-200">{topic.title}</h3>
                    <div className="flex items-center mt-1">
                      <span className="text-sm text-gray-500 dark:text-gray-400 mr-3">{topic.field}</span>
                      <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 px-2 py-0.5 rounded-full">
                        +{topic.growth} interest
                      </span>
                    </div>
                  </div>
                  <IconBulb className="h-5 w-5 text-amber-400 ml-2" strokeWidth={1.5} />
                </div>
              ))}
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center p-4 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-lg">
              <div className="flex items-center mb-3 md:mb-0">
                <IconBulb className="h-5 w-5 text-amber-500 dark:text-amber-400 mr-2" strokeWidth={1.5} />
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Pro Tip:</span> These represent the fastest-growing tech research areas this month.
                </p>
              </div>
              <button className="text-sm text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 font-medium flex items-center">
                View all tech trends
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}