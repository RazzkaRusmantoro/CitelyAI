"use client";

import { useState } from "react";
import {
  FileText,
  Copy,
  Check,
  AlertCircle,
  Loader2,
  RefreshCw,
  Calendar as CalendarIcon,
  ChevronDown,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { IconInfoCircle, IconBulb } from '@tabler/icons-react';

type CitationMetadata = {
  title: string;
  author: string;
  pub_date: Date | string;
  url: string;
  access_date: Date | string;
};

export default function CitePage() {
  const [url, setUrl] = useState("");
  const [style, setStyle] = useState("harvard");
  const [loading, setLoading] = useState(false);
  const [citation, setCitation] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [metadata, setMetadata] = useState<CitationMetadata | null>(null);
  const [editedMetadata, setEditedMetadata] = useState<CitationMetadata | null>(
    null
  );
  const [updating, setUpdating] = useState(false);
  const [isStyleOpen, setIsStyleOpen] = useState(false);

  const styles = [
    { value: "harvard", label: "Harvard" },
    { value: "apa", label: "APA" },
    { value: "mla", label: "MLA" },
  ];

  const selectedStyle = styles.find(s => s.value === style) || styles[0];

  const handleSubmit = async () => {
    setLoading(true);
    setCitation(null);
    setError(null);

    try {
      const res = await fetch("/api/cite-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, style }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        const msg =
          (errorData && (errorData.error || errorData.message)) ||
          `Failed to generate citation (status ${res.status})`;
        throw new Error(msg);
      }

      const data = await res.json();

      const newMetadata = {
        title: data.title || extractTitleFromCitation(data.citation),
        author: data.author || extractAuthorFromCitation(data.citation),
        pub_date: data.pub_date
          ? new Date(data.pub_date)
          : extractDateFromCitation(data.citation),
        url: url,
        access_date: new Date(),
      };

      setMetadata(newMetadata);
      setEditedMetadata(newMetadata);
      setCitation(data.citation);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const extractTitleFromCitation = (citation: string) => {
    const match = citation.match(/"(.*?)"/);
    return match ? match[1] : "Unknown Title";
  };

  const extractAuthorFromCitation = (citation: string) => {
    const match = citation.match(/^(.*?) \(/);
    return match ? match[1] : "Unknown Author";
  };

  const extractDateFromCitation = (citation: string): Date | string => {
    const match = citation.match(/\(([0-9]{4})\)/);
    return match ? new Date(parseInt(match[1]), 0, 1) : "n.d.";
  };

  const handleMetadataChange = (
    field: keyof CitationMetadata,
    value: string | Date
  ) => {
    if (editedMetadata) {
      setEditedMetadata({
        ...editedMetadata,
        [field]: value,
      });
    }
  };

  const handleUpdateCitation = async () => {
    if (!editedMetadata) return;

    setUpdating(true);
    setError(null);

    try {
      const res = await fetch("/api/update-citation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          metadata: editedMetadata,
          style,
          url,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(
          (errorData && (errorData.error || errorData.message)) ||
            `Failed to update citation (status ${res.status})`
        );
      }

      const data = await res.json();
      setCitation(data.citation);
      setMetadata(editedMetadata);
    } catch (err: any) {
      setError(err.message || "Failed to update citation.");
    } finally {
      setUpdating(false);
    }
  };

  const handleCopy = () => {
    if (!citation) return;
    navigator.clipboard.writeText(citation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen w-full bg-white dark:bg-gray-900">
      <div className="w-full max-w-7xl mx-auto px-4 py-10">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-black dark:text-white">
              Academic Citation Generator
            </h1>
            <p className="text-xl md:text-2xl font-medium text-gray-800 dark:text-gray-300">
              Perfect citations in seconds. Supports Harvard, APA, and MLA styles.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left panel - Input form */}
              <div className="w-full lg:w-2/5">
                <div className="space-y-6">
                  <div>
                    <label
                      htmlFor="url"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Website URL
                    </label>
                    <input
                      id="url"
                      type="url"
                      placeholder="https://example.com/article"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Citation Style
                    </label>
                    <div className="relative">
                      <button
                        onClick={() => setIsStyleOpen(!isStyleOpen)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition appearance-none dark:bg-gray-700 dark:text-white flex items-center justify-between"
                      >
                        <span>{selectedStyle.label}</span>
                        <ChevronDown className={`h-4 w-4 transition-transform ${isStyleOpen ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {isStyleOpen && (
                        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg">
                          {styles.map((styleOption) => (
                            <button
                              key={styleOption.value}
                              onClick={() => {
                                setStyle(styleOption.value);
                                setIsStyleOpen(false);
                              }}
                              className={`w-full text-left px-4 py-2 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition ${
                                style === styleOption.value
                                  ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                                  : 'text-gray-700 dark:text-gray-300'
                              }`}
                            >
                              {styleOption.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={!url || loading}
                    className={`w-full py-3 px-4 rounded-lg font-medium text-white ${
                      !url || loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-amber-600 hover:bg-amber-700 transition cursor-pointer"
                    } focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2`}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                        Generating...
                      </span>
                    ) : (
                      "Generate Citation"
                    )}
                  </button>
                  
                  {/* Additional info to fill space when citation is generated */}
                  {citation && (
                    <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                      <h3 className="font-medium text-amber-800 dark:text-amber-300 mb-2 flex items-center">
                        <IconInfoCircle className="h-4 w-4 mr-1" />
                        Citation Tips
                      </h3>
                      <ul className="text-sm text-amber-700 dark:text-amber-400 space-y-1">
                        <li>• Always verify dates and author names</li>
                        <li>• Check against official style guides</li>
                        <li>• Include URLs for online sources</li>
                        <li>• Update access dates for web sources</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Right panel - Citation preview and editing */}
              <div className="w-full lg:w-3/5">
                <div className="rounded-xl p-6 border border-gray-200 dark:border-gray-700 min-h-[400px]">
                  <h2 className="text-xl font-semibold text-amber-800 dark:text-amber-400 mb-4 flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Citation Details
                  </h2>

                  {!metadata ? (
                    <div className="h-64 flex items-center justify-center">
                      <p className="text-gray-500 dark:text-gray-400 italic text-center">
                        Paste a URL and click "Generate Citation" to get started
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Title
                        </label>
                        <input
                          type="text"
                          value={editedMetadata?.title || ""}
                          onChange={(e) =>
                            handleMetadataChange("title", e.target.value)
                          }
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition dark:bg-gray-700 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Author
                        </label>
                        <input
                          type="text"
                          value={editedMetadata?.author || ""}
                          onChange={(e) =>
                            handleMetadataChange("author", e.target.value)
                          }
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition dark:bg-gray-700 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Publication Date
                        </label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={`w-full justify-start text-left font-normal dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                                !editedMetadata?.pub_date ? "text-gray-400" : ""
                              }`}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {editedMetadata?.pub_date ? (
                                typeof editedMetadata.pub_date === "string" ? (
                                  editedMetadata.pub_date
                                ) : (
                                  format(editedMetadata.pub_date, "PPP")
                                )
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 dark:bg-gray-800 dark:border-gray-700">
                            <Calendar
                              mode="single"
                              selected={
                                typeof editedMetadata?.pub_date === "string"
                                  ? new Date(editedMetadata.pub_date)
                                  : editedMetadata?.pub_date || undefined
                              }
                              onSelect={(date) => {
                                if (date && editedMetadata) {
                                  handleMetadataChange("pub_date", date);
                                }
                              }}
                              initialFocus
                              className="dark:bg-gray-800"
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Access Date
                        </label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={`w-full justify-start text-left font-normal dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                                !editedMetadata?.access_date ? "text-gray-400" : ""
                              }`}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {editedMetadata?.access_date ? (
                                typeof editedMetadata.access_date === "string" ? (
                                  editedMetadata.access_date
                                ) : (
                                  format(editedMetadata.access_date, "PPP")
                                )
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 dark:bg-gray-800 dark:border-gray-700">
                            <Calendar
                              mode="single"
                              selected={
                                typeof editedMetadata?.access_date === "string"
                                  ? new Date(editedMetadata.access_date)
                                  : editedMetadata?.access_date || undefined
                              }
                              onSelect={(date) => {
                                if (date && editedMetadata) {
                                  handleMetadataChange("access_date", date);
                                }
                              }}
                              initialFocus
                              className="dark:bg-gray-800"
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <button
                        onClick={handleUpdateCitation}
                        disabled={
                          !editedMetadata ||
                          JSON.stringify(metadata) ===
                            JSON.stringify(editedMetadata) ||
                          updating
                        }
                        className={`w-full group py-2 px-4 rounded-lg font-medium text-white ${
                          !editedMetadata ||
                          JSON.stringify(metadata) ===
                            JSON.stringify(editedMetadata) ||
                          updating
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-amber-600 hover:bg-amber-700 transition cursor-pointer"
                        } focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 flex items-center justify-center`}
                      >
                        {updating ? (
                          <>
                            <Loader2 className="animate-spin h-4 w-4 mr-2" />
                            Updating...
                          </>
                        ) : (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 group-hover:animate-[spin-once_0.5s_ease]" />
                            Update Citation
                          </>
                        )}
                      </button>
                      {error && (
                        <div className="text-red-600 dark:text-red-400 text-sm mt-2 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" /> {error}
                        </div>
                      )}

                      {citation && (
                        <div className="mt-4 p-4 border border-amber-200 dark:border-amber-800 rounded-lg bg-white dark:bg-gray-800">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-400">
                              Generated Citation:
                            </h3>
                            <button
                              onClick={handleCopy}
                              className="text-sm text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 transition flex items-center"
                            >
                              {copied ? (
                                <>
                                  <Check className="h-4 w-4 mr-1" />
                                  Copied!
                                </>
                              ) : (
                                <>
                                  <Copy className="h-4 w-4 mr-1" />
                                  Copy
                                </>
                              )}
                            </button>
                          </div>
                          <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap text-sm">
                            {citation}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* How it works section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-amber-400 to-orange-500 p-2 rounded-full mr-3">
                <IconInfoCircle className="h-5 w-5 text-white" strokeWidth={1.5} />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                How Our Citation Generator Works
              </h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start p-4 hover:bg-amber-50 dark:hover:bg-amber-900/10 rounded-lg transition-colors">
                <div className="bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 p-3 rounded-full mr-4 flex-shrink-0">
                  <FileText className="h-5 w-5 text-amber-600 dark:text-amber-400" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-medium text-lg text-gray-800 dark:text-gray-200 mb-2">Extract Metadata</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    We analyze the webpage to extract title, author, publication date, and other relevant information.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start p-4 hover:bg-amber-50 dark:hover:bg-amber-900/10 rounded-lg transition-colors">
                <div className="bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 p-3 rounded-full mr-4 flex-shrink-0">
                  <RefreshCw className="h-5 w-5 text-amber-600 dark:text-amber-400" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-medium text-lg text-gray-800 dark:text-gray-200 mb-2">Format According to Style</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    We format the citation according to your selected style guide (Harvard, APA, or MLA).
                  </p>
                </div>
              </div>
              
              <div className="flex items-start p-4 hover:bg-amber-50 dark:hover:bg-amber-900/10 rounded-lg transition-colors">
                <div className="bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 p-3 rounded-full mr-4 flex-shrink-0">
                  <Copy className="h-5 w-5 text-amber-600 dark:text-amber-400" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-medium text-lg text-gray-800 dark:text-gray-200 mb-2">Easy Copy & Paste</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Copy your perfectly formatted citation with a single click for use in your research papers.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start p-4 hover:bg-amber-50 dark:hover:bg-amber-900/10 rounded-lg transition-colors">
                <div className="bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 p-3 rounded-full mr-4 flex-shrink-0">
                  <Check className="h-5 w-5 text-amber-600 dark:text-amber-400" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-medium text-lg text-gray-800 dark:text-gray-200 mb-2">Manual Adjustments</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Fine-tune any details with our easy-to-use editor to ensure 100% accuracy.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-lg">
              <div className="flex items-center">
                <IconBulb className="h-5 w-5 text-amber-500 dark:text-amber-400 mr-2" strokeWidth={1.5} />
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Pro Tip:</span> Always double-check citations against official style guides for important academic work.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}