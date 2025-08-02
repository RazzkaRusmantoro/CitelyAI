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
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

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
      // optional: setMetadata(editedMetadata) to make this the new baseline
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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-amber-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-10 right-20 w-32 h-32 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-20 left-1/4 w-32 h-32 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

      <div className="relative max-w-6xl w-full mx-auto bg-white rounded-xl shadow-lg overflow-hidden md:max-w-7xl z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-600 opacity-5"></div>

        <div className="p-8 relative flex flex-col md:flex-row gap-8">
          {/* Left panel - Input form */}
          <div className="w-full md:w-1/2">
            <div className="text-center mb-8">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-amber-100 mb-4">
                <FileText className="h-8 w-8 text-amber-600" />
              </div>
              <h1 className="text-3xl font-bold text-amber-600">
                Academic Citation Generator
              </h1>
              <p className="mt-2 text-gray-600">
                Perfect citations in seconds. Supports Harvard, APA, and MLA
                styles.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label
                  htmlFor="url"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Website URL
                </label>
                <input
                  id="url"
                  type="url"
                  placeholder="https://example.com/article"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="style"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Citation Style
                </label>
                <select
                  id="style"
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition appearance-none bg-white"
                >
                  <option value="harvard">Harvard</option>
                  <option value="apa">APA</option>
                  <option value="mla">MLA</option>
                </select>
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
            </div>
          </div>

          {/* Right panel - Citation preview and editing */}
          <div className="w-full md:w-1/2 bg-amber-50 rounded-xl p-6 border border-amber-100">
            <h2 className="text-xl font-semibold text-amber-800 mb-4 flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Citation Details
            </h2>

            {!metadata ? (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-500 italic">
                  Paste a link and click "Generate Citation" to get started
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={editedMetadata?.title || ""}
                    onChange={(e) =>
                      handleMetadataChange("title", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Author
                  </label>
                  <input
                    type="text"
                    value={editedMetadata?.author || ""}
                    onChange={(e) =>
                      handleMetadataChange("author", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Publication Date
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={`w-full justify-start text-left font-normal ${
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
                    <PopoverContent className="w-auto p-0">
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
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Access Date
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={`w-full justify-start text-left font-normal ${
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
                    <PopoverContent className="w-auto p-0">
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
                  <div className="text-red-600 text-sm mt-2 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" /> {error}
                  </div>
                )}

                {citation && (
                  <div className="mt-4 p-4 border border-amber-200 rounded-lg bg-white">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-semibold text-amber-800">
                        Generated Citation:
                      </h3>
                      <button
                        onClick={handleCopy}
                        className="text-sm text-amber-600 hover:text-amber-800 transition flex items-center"
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
                    <p className="text-gray-800 whitespace-pre-wrap text-sm">
                      {citation}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer with additional info */}
      <div className="mt-8 text-center text-gray-500 text-sm">
        <p>Need help with academic writing? We've got you covered.</p>
        <p className="mt-1">
          100% accurate citations for your research papers.
        </p>
      </div>
    </div>
  );
}
