import { 
  IconFile,
  IconBookmark,
  IconSearch,
  IconNotebook,
  IconSquare,
  IconChevronsRight,
  IconBookmarkFilled,
  IconFileText,
  IconBooks,
  IconFileAnalytics,
  IconListDetails,
  IconFileSpreadsheet
} from "@tabler/icons-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change: string;
  icon: React.ReactNode;
}

interface ToolCardProps {
  name: string;
  description: string;
  icon: React.ReactNode;
}

export default function DashboardCitation() {
  const tools = [
    {
      name: "Basic AI Citation Assistant",
      description: "Generate standard citations in multiple formats",
      icon: <IconFile size={24} />
    },
    {
      name: "Premium AI Citation Assistant",
      description: "Advanced citation generation with smart formatting",
      icon: <IconFileText size={24} />
    },
    {
      name: "Academic Source Finder",
      description: "Discover credible sources for your research",
      icon: <IconSearch size={24} />
    },
    {
      name: "Academic Citer",
      description: "Automatically format citations from databases",
      icon: <IconNotebook size={24} />
    },
    {
      name: "Paper Summarizer",
      description: "Get concise summaries of research papers",
      icon: <IconFileAnalytics size={24} />
    },
    {
      name: "Bibliography Manager",
      description: "Organize all your references in one place",
      icon: <IconBooks size={24} />
    },
    {
      name: "Source Credibility Checker",
      description: "Evaluate the reliability of sources",
      icon: <IconListDetails size={24} />
    }
  ];

  return (
    <main className="min-h-screen w-full">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="w-full pt-8 mb-5">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold text-black">
              Citely Dashboard
            </h1>
            <p className="text-xl md:text-2xl font-medium text-gray-800">
              Welcome, Abdur Cader!
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard 
            title="Recent Projects" 
            value="12" 
            change="+2 this week"
            icon={<IconSquare size={24} />}
          />
          <StatCard 
            title="Citations Generated" 
            value="247" 
            change="+34 this month"
            icon={<IconChevronsRight size={24} />}
          />
          <StatCard 
            title="Sources Saved" 
            value="1,428" 
            change="+128 this month"
            icon={<IconBookmarkFilled size={24} />}
          />
        </div>

        <div className="bg-[#F5F6F8] h-60 mb-8 relative">
          <h2 className="text-2xl font-semibold text-gray-900 absolute top-6 left-6 md:top-8 md:left-8">
            Get Started with Citely
          </h2>
        </div>

        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Research Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool, index) => (
            <ToolCard
              key={index}
              name={tool.name}
              description={tool.description}
              icon={tool.icon}
            />
          ))}
        </div>
      </div>
    </main>
  );
}

function StatCard({ title, value, change, icon }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 flex items-start">
      <div className="p-3 rounded-md bg-yellow-50 text-yellow-600 mr-4">
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
        <p className="text-sm text-green-600 mt-1">{change}</p>
      </div>
    </div>
  );
}

function ToolCard({ name, description, icon }: ToolCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 border border-gray-200">
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className="p-3 rounded-md bg-yellow-50 text-yellow-600 mr-4">
            {icon}
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
        </div>
        <p className="text-gray-600 mb-6">{description}</p>
        <button className="hover:cursor-pointer w-full py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200">
          Open Tool
        </button>
      </div>
    </div>
  );
}