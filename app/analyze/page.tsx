"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppSelector, useAppDispatch } from "../../lib/hooks";
import {
  setRepoUrl,
  setAnalysis,
  setGeneratedReadme,
  setLoading,
  setError,
} from "../../features/analysis/analysisSlice";
import { logout } from "../../features/auth/authSlice";

export default function AnalyzePage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const { repoUrl, analysis, generatedReadme, loading, error } = useAppSelector(
    (state) => state.analysis
  );

  const { isLoggedIn, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    // Check for repo query param
    const urlParams = new URLSearchParams(window.location.search);
    const repoParam = urlParams.get("repo");
    if (repoParam) {
      dispatch(setRepoUrl(repoParam));
    }
  }, [isLoggedIn, router, dispatch]);

  const extractRepoInfo = (url: string) => {
    // Clean up URL by removing .git suffix and any trailing slashes
    const cleanUrl = url.replace(/\.git$/, "").replace(/\/$/, "");
    const match = cleanUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!match) return null;
    return { owner: match[1], repo: match[2] };
  };

  const handleAnalyze = async () => {
    const repoInfo = extractRepoInfo(repoUrl);
    if (!repoInfo) {
      dispatch(setError("Please enter a valid GitHub repository URL"));
      return;
    }

    dispatch(setLoading(true));
    dispatch(setError(""));
    dispatch(setAnalysis(null));
    dispatch(setGeneratedReadme(""));

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/analyze-repo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(repoInfo),
      });

      if (response.ok) {
        const data = await response.json();
        dispatch(setAnalysis(data));
      } else {
        const errorData = await response.json();
        if (response.status === 401 && errorData.error === "Unauthorized") {
          dispatch(logout());
          router.push("/login");
          return;
        }
        dispatch(
          setError(
            errorData.error ||
              "Failed to analyze repository. Please check the URL and try again."
          )
        );
      }
    } catch (err) {
      console.error("Analyze repository error:", err);
      dispatch(
        setError("Network error. Please check your connection and try again.")
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleGenerateReadme = async () => {
    if (!analysis) return;

    dispatch(setLoading(true));
    dispatch(setError(""));

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/generate-readme", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ analysis }),
      });

      if (response.ok) {
        const data = await response.json();
        dispatch(setGeneratedReadme(data.readme));
      } else {
        const errorData = await response.json();
        dispatch(
          setError(
            errorData.error || "Failed to generate README. Please try again."
          )
        );
      }
    } catch (err) {
      console.error("Generate README error:", err);
      dispatch(
        setError("Network error. Please check your connection and try again.")
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("token");
    dispatch(logout());
    router.push("/");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedReadme);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Navigation */}
      <nav className="fixed w-full bg-gray-900/90 backdrop-blur-sm z-50 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link
                href="/"
                className="flex-shrink-0 font-bold text-xl text-blue-400 hover:text-blue-300 transition-colors"
              >
                <span className="flex items-center">
                  <svg
                    className="w-6 h-6 mr-2"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                  </svg>
                  GitDocify
                </span>
              </Link>
              <div className="hidden md:block ml-10">
                <div className="flex space-x-4">
                  <Link
                    href="/repositories"
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                  >
                    My Repositories
                  </Link>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6 space-x-4">
                <span className="text-gray-300 text-sm">
                  Welcome, {user?.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center"
                >
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-white mb-2">
              Analyze Repository
            </h1>
            <p className="text-gray-300">
              Paste a GitHub repository URL to analyze and generate professional
              documentation
            </p>
          </div>

          {/* Input Section */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 mb-8 shadow-lg">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={repoUrl}
                  onChange={(e) => dispatch(setRepoUrl(e.target.value))}
                  placeholder="https://github.com/owner/repository"
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  onKeyPress={(e) => e.key === "Enter" && handleAnalyze()}
                />
              </div>
              <button
                onClick={handleAnalyze}
                disabled={loading || !repoUrl}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-md text-white font-medium transition-colors flex items-center justify-center min-w-[160px]"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                    Analyze Repository
                  </>
                )}
              </button>
            </div>
            {error && (
              <div className="mt-4 p-3 bg-red-900/30 border border-red-700 rounded-md">
                <p className="text-red-400 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {error}
                </p>
              </div>
            )}
          </div>

          {/* Analysis Results */}
          {analysis && (
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 mb-8 shadow-lg">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Repository Analysis
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-blue-400 mb-2">
                    {analysis.name}
                  </h3>
                  <p className="text-gray-300 mb-4">
                    {analysis.description || "No description available"}
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-center">
                      <span className="text-gray-400 w-24">Language:</span>
                      <span className="ml-2 text-white font-medium">
                        {analysis.language || "Not specified"}
                      </span>
                    </div>

                    <div className="flex items-center">
                      <span className="text-gray-400 w-24">Stars:</span>
                      <span className="ml-2 text-white flex items-center">
                        <svg
                          className="w-4 h-4 mr-1 text-yellow-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {analysis.stars || "N/A"}
                      </span>
                    </div>

                    <div className="flex items-center">
                      <span className="text-gray-400 w-24">Last updated:</span>
                      <span className="ml-2 text-white">
                        {analysis.updatedAt
                          ? new Date(analysis.updatedAt).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                  </div>

                  {analysis.topics && analysis.topics.length > 0 && (
                    <div className="mt-4">
                      <span className="text-gray-400">Topics:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {analysis.topics.map((topic, index) => (
                          <span
                            key={index}
                            className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-sm"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="text-md font-semibold text-white mb-2 flex items-center">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                      />
                    </svg>
                    Key Files ({analysis.files?.length || 0})
                  </h4>
                  <div className="bg-gray-900 rounded-md p-3 max-h-40 overflow-y-auto">
                    {analysis.files &&
                      analysis.files.slice(0, 10).map((file, index) => (
                        <div
                          key={index}
                          className="text-sm text-gray-300 py-1 flex items-center"
                        >
                          <svg
                            className="w-4 h-4 mr-2 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          {file.name}
                        </div>
                      ))}
                    {analysis.files && analysis.files.length > 10 && (
                      <div className="text-sm text-gray-500 pt-2">
                        ... and {analysis.files.length - 10} more files
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={handleGenerateReadme}
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed rounded-md text-white font-medium transition-all flex items-center"
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Generating...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                      Generate README with AI
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* AI Analysis */}
          {analysis && analysis.aiAnalysis && (
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 mb-8 shadow-lg">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                AI-Powered Analysis
              </h2>
              <div className="bg-gray-900 rounded-lg p-4 max-h-96 overflow-y-auto">
                <pre className="text-gray-300 whitespace-pre-wrap text-sm font-sans">
                  {analysis.aiAnalysis}
                </pre>
              </div>
            </div>
          )}

          {/* Generated README */}
          {generatedReadme && (
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Generated README
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={copyToClipboard}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-md text-white text-sm font-medium transition-colors flex items-center"
                  >
                    {copied ? (
                      <>
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Copied!
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                        Copy
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      const blob = new Blob([generatedReadme], {
                        type: "text/markdown",
                      });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = "README.md";
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-md text-white text-sm font-medium transition-colors flex items-center"
                  >
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    Download
                  </button>
                </div>
              </div>
              <div className="bg-gray-900 rounded-lg p-4 max-h-96 overflow-y-auto">
                <pre className="text-gray-300 whitespace-pre-wrap text-sm font-mono">
                  {generatedReadme}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
