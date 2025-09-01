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
  IconFileSpreadsheet,
} from "@tabler/icons-react";
import { getUser } from "@/app/auth/getUser";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

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

export default async function DashboardCitation() {
  const supabase = await createClient();
  const user = await getUser();

  let filesCount = 0;
  let filesProCount = 0;
  let sourcesSaved = 0;
  let citationsGenerated = 0;
  let recentFiles: any[] = [];

  if (user) {
    // Count from files table
    const { count: filesCountData, error: filesError } = await supabase
      .from("files")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    if (!filesError && filesCountData) {
      filesCount = filesCountData;
    }

    // Count from files_pro table
    const { count: filesProCountData, error: filesProError } = await supabase
      .from("files_pro")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    if (!filesProError && filesProCountData) {
      filesProCount = filesProCountData;
    }

    // Get references from bibliography table
    const { data: bibliographyData, error: bibliographyError } = await supabase
      .from("bibliography")
      .select("references")
      .eq("user_id", user.id)
      .single();

    if (!bibliographyError && bibliographyData && bibliographyData.references) {
      // Count the number of references in the JSONB column
      try {
        const references = bibliographyData.references;
        if (Array.isArray(references)) {
          sourcesSaved = references.length;
        } else if (typeof references === "object" && references !== null) {
          sourcesSaved = Object.keys(references).length;
        }
      } catch (error) {
        console.error("Error parsing references:", error);
      }
    }

    // Get citations from files table
    const { data: filesData, error: filesCitationsError } = await supabase
      .from("files")
      .select("citations")
      .eq("user_id", user.id);

    if (!filesCitationsError && filesData) {
      filesData.forEach((file) => {
        if (file.citations) {
          try {
            const citations = file.citations;
            if (Array.isArray(citations)) {
              citationsGenerated += citations.length;
            } else if (typeof citations === "object" && citations !== null) {
              citationsGenerated += Object.keys(citations).length;
            }
          } catch (error) {
            console.error("Error parsing citations from files table:", error);
          }
        }
      });
    }

    // Get citations from files_pro table
    const { data: filesProData, error: filesProCitationsError } = await supabase
      .from("files_pro")
      .select("citations")
      .eq("user_id", user.id);

    if (!filesProCitationsError && filesProData) {
      filesProData.forEach((file) => {
        if (file.citations) {
          try {
            const citations = file.citations;
            if (Array.isArray(citations)) {
              citationsGenerated += citations.length;
            } else if (typeof citations === "object" && citations !== null) {
              citationsGenerated += Object.keys(citations).length;
            }
          } catch (error) {
            console.error(
              "Error parsing citations from files_pro table:",
              error
            );
          }
        }
      });
    }

    // Get recent files
    const { data: recentFilesData, error: recentFilesError } = await supabase
      .from("files")
      .select("id, filename, opened_at, file_url")
      .eq("user_id", user.id)
      .order("opened_at", { ascending: false })
      .limit(3);

    if (!recentFilesError && recentFilesData) {
      recentFiles = recentFilesData;
    }
  }

  const totalProjects = filesCount + filesProCount;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds} second${diffInSeconds === 1 ? "" : "s"} ago`;
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes === 1 ? "" : "s"} ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours === 1 ? "" : "s"} ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) {
      return "Yesterday";
    }

    if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays === 1 ? "" : "s"} ago`;
    }

    return date.toLocaleDateString();
  };

  const tools = [
    {
      name: "Basic AI Citation Assistant",
      description: "Generate standard citations in multiple formats",
      icon: <IconFile size={24} />,
    },
    {
      name: "Premium AI Citation Assistant",
      description: "Advanced citation generation with smart formatting",
      icon: <IconFileText size={24} />,
    },
    {
      name: "Academic Source Finder",
      description: "Discover credible sources for your research",
      icon: <IconSearch size={24} />,
    },
    {
      name: "Academic Citer",
      description: "Automatically format citations from databases",
      icon: <IconNotebook size={24} />,
    },
    {
      name: "Paper Summarizer",
      description: "Get concise summaries of research papers",
      icon: <IconFileAnalytics size={24} />,
    },
    {
      name: "Bibliography Manager",
      description: "Organize all your references in one place",
      icon: <IconBooks size={24} />,
    },
    {
      name: "Source Credibility Checker",
      description: "Evaluate the reliability of sources",
      icon: <IconListDetails size={24} />,
    },
  ];

  return (
    <main className="min-h-screen w-full">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="w-full pt-8 mb-5">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold text-black">
              Citera Dashboard
            </h1>
            <p className="text-xl md:text-2xl font-medium text-gray-800">
              Welcome, {user?.user_metadata?.full_name || "User"}!
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Recent Projects"
            value={totalProjects}
            change="+2 this week"
            icon={<IconSquare size={24} />}
          />
          <StatCard
            title="Citations Generated"
            value={citationsGenerated}
            change="+34 this month"
            icon={<IconChevronsRight size={24} />}
          />
          <StatCard
            title="Sources Saved"
            value={sourcesSaved}
            change="+128 this month"
            icon={<IconBookmarkFilled size={24} />}
          />
        </div>

        <div className="bg-yellow-50 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Recent Citera Projects
          </h2>

          {recentFiles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recentFiles.map((file) => (
                <Link
                  key={file.id}
                  href={`/ai-citation?fileId=${file.id}`}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-300"
                >
                  <div className="flex items-center mb-3">
                    <div className="p-2 rounded-md bg-yellow-50 text-yellow-600 mr-3">
                      <IconFile size={20} />
                    </div>
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {file.filename}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-500">
                    Opened {formatDate(file.opened_at)}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center mb-5 px-4 bg-yellow-50 rounded-lg ">
              <div className="mb-4 flex justify-center">
                <div className="bg-yellow-50 rounded-full">
                  <IconFile size={40} className="text-yellow-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                No projects yet
              </h3>
              <p className="text-gray-600 text-sm max-w-md mx-auto mb-5">
                Get started by creating your first citation project. We'll help
                you organize and track all your research in one place.
              </p>
              <Link
                href="/dashboard/ai-citation"
                className="group inline-flex items-center px-4 py-2.5 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-lg transition-all duration-200 hover:shadow-md"
              >
                <IconFile className="mr-2" size={18} />
                Create Your First Project
                <IconChevronsRight
                  className="ml-1.5 transition-transform duration-300 group-hover:translate-x-1"
                  size={18}
                />
              </Link>
            </div>
          )}
        </div>

        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Research Tools
        </h2>
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
