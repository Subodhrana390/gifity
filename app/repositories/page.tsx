"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../lib/store";
import {
  setRepositories,
  setLoading,
  setError,
  clearRepositories,
} from "../../features/repositories/repositoriesSlice";
import { logout } from "../../features/auth/authSlice";

export default function RepositoriesPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("updated");
  const [filterBy, setFilterBy] = useState("all");
  const [isScrolled, setIsScrolled] = useState(false);

  const repositories = useSelector(
    (state: RootState) => state.repositories.repositories
  );
  const loading = useSelector((state: RootState) => state.repositories.loading);
  const error = useSelector((state: RootState) => state.repositories.error);
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const userEmail = useSelector((state: RootState) => state.auth.user?.email);
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isLoggedIn || !token) {
      router.push("/login");
      return;
    }

    fetchRepositories(token);
  }, [isLoggedIn, token, router]);

  const fetchRepositories = async (token: string) => {
    dispatch(setLoading(true));
    dispatch(setError(""));
    try {
      const response = await fetch("/api/github/repositories", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        dispatch(setRepositories(data.repositories));
      } else {
        const errorData = await response.json();
        dispatch(setError(errorData.error || "Failed to fetch repositories"));
      }
    } catch (err) {
      dispatch(setError("Failed to fetch repositories"));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleLogout = () => {
    // Note: Removed localStorage usage as per Claude artifacts restrictions
    dispatch(logout());
    dispatch(clearRepositories());
    router.push("/");
  };

  const handleConnectGitHub = () => {
    const GITHUB_CLIENT_ID = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID || "";
    const redirectUri = `${window.location.origin}/auth/github/callback`;
    const githubUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${redirectUri}&scope=repo,user`;
    window.location.href = githubUrl;
  };

  const getLanguageColor = (language: string) => {
    const colors = {
      JavaScript: "bg-yellow-400",
      TypeScript: "bg-blue-400",
      Python: "bg-green-400",
      Java: "bg-red-400",
      Go: "bg-cyan-400",
      Rust: "bg-orange-400",
      PHP: "bg-purple-400",
      Ruby: "bg-red-500",
      HTML: "bg-orange-500",
      CSS: "bg-blue-500",
    };
    return colors[language as keyof typeof colors] || "bg-gray-400";
  };

  const filteredAndSortedRepos = repositories
    .filter((repo) => {
      const matchesSearch =
        repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (repo.description || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      if (filterBy === "all") return matchesSearch;
      if (filterBy === "public") return matchesSearch && !repo.private;
      if (filterBy === "private") return matchesSearch && repo.private;
      if (filterBy === "forks") return matchesSearch && repo.fork;

      return matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "updated":
          return (
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
          );
        case "stars":
          return (b.stargazers_count || 0) - (a.stargazers_count || 0);
        case "created":
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
        <nav className="fixed w-full bg-slate-900/95 backdrop-blur-lg z-50 border-b border-purple-500/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link
                href="/"
                className="font-bold text-xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
              >
                GitDocify
              </Link>
            </div>
          </div>
        </nav>

        <div className="pt-32 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="relative mb-8">
              <div className="w-20 h-20 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin mx-auto"></div>
              <div
                className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-blue-500 rounded-full animate-spin mx-auto"
                style={{
                  animationDirection: "reverse",
                  animationDuration: "1.5s",
                }}
              ></div>
            </div>
            <h2 className="text-2xl font-semibold mb-2">
              Loading Your Repositories
            </h2>
            <p className="text-gray-400">
              Fetching your latest projects from GitHub...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
        <nav className="fixed w-full bg-slate-900/95 backdrop-blur-lg z-50 border-b border-purple-500/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link
                href="/"
                className="font-bold text-xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
              >
                GitDocify
              </Link>
            </div>
          </div>
        </nav>

        <div className="pt-32 flex items-center justify-center min-h-screen px-4">
          <div className="text-center max-w-md">
            <div className="w-24 h-24 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
              <svg
                className="w-12 h-12 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-4">
              GitHub Integration Required
            </h1>
            <p className="text-gray-300 mb-8 leading-relaxed">{error}</p>
            <button
              onClick={handleConnectGitHub}
              className="group px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl hover:shadow-purple-500/25 flex items-center gap-3 mx-auto"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
              Connect GitHub Account
              <svg
                className="w-4 h-4 transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Enhanced Navigation */}
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-slate-900/95 backdrop-blur-lg border-b border-purple-500/20 shadow-lg shadow-purple-500/10"
            : "bg-slate-900/80 backdrop-blur-sm border-b border-slate-800"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link
                href="/"
                className="font-bold text-xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent hover:from-blue-300 hover:to-purple-300 transition-all duration-200"
              >
                GitDocify
              </Link>
              <div className="hidden md:flex items-center gap-6">
                <Link
                  href="/"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Home
                </Link>
                <Link
                  href="/analyze"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Analyze Repository
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-sm font-bold">
                  {userEmail?.[0]?.toUpperCase()}
                </div>
                <span className="text-gray-300 text-sm max-w-32 truncate">
                  {userEmail}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="text-gray-400 hover:text-white transition-colors duration-200 px-4 py-2 rounded-lg hover:bg-white/10"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                  Your Repositories
                </span>
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Select any repository to generate comprehensive documentation
                automatically
              </p>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-slate-800/50 to-purple-800/20 rounded-xl p-6 border border-slate-700/50">
                <div className="text-2xl font-bold text-white">
                  {repositories.length}
                </div>
                <div className="text-gray-400 text-sm">Total Repositories</div>
              </div>
              <div className="bg-gradient-to-br from-slate-800/50 to-purple-800/20 rounded-xl p-6 border border-slate-700/50">
                <div className="text-2xl font-bold text-white">
                  {repositories.filter((r) => !r.private).length}
                </div>
                <div className="text-gray-400 text-sm">Public Repositories</div>
              </div>
              <div className="bg-gradient-to-br from-slate-800/50 to-purple-800/20 rounded-xl p-6 border border-slate-700/50">
                <div className="text-2xl font-bold text-white">
                  {repositories.filter((r) => r.private).length}
                </div>
                <div className="text-gray-400 text-sm">
                  Private Repositories
                </div>
              </div>
              <div className="bg-gradient-to-br from-slate-800/50 to-purple-800/20 rounded-xl p-6 border border-slate-700/50">
                <div className="text-2xl font-bold text-white">
                  {
                    new Set(
                      repositories
                        .filter((r) => r.language)
                        .map((r) => r.language)
                    ).size
                  }
                </div>
                <div className="text-gray-400 text-sm">Languages Used</div>
              </div>
            </div>

            {/* Search and Filter Controls */}
            <div className="bg-slate-900/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search */}
                <div className="md:col-span-2">
                  <div className="relative">
                    <svg
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    <input
                      type="text"
                      placeholder="Search repositories..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white transition-all duration-200"
                >
                  <option value="updated">Recently Updated</option>
                  <option value="name">Name A-Z</option>
                  <option value="stars">Most Stars</option>
                  <option value="created">Recently Created</option>
                </select>

                {/* Filter */}
                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value)}
                  className="px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white transition-all duration-200"
                >
                  <option value="all">All Repositories</option>
                  <option value="public">Public Only</option>
                  <option value="private">Private Only</option>
                  <option value="forks">Forks Only</option>
                </select>
              </div>
            </div>
          </div>

          {/* Repositories Grid */}
          {filteredAndSortedRepos.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-500/20 to-slate-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                {repositories.length === 0
                  ? "No Repositories Found"
                  : "No Matching Repositories"}
              </h3>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                {repositories.length === 0
                  ? "Connect your GitHub account to see your repositories and start generating documentation."
                  : "Try adjusting your search or filter criteria to find the repositories you're looking for."}
              </p>
              {repositories.length === 0 && (
                <button
                  onClick={handleConnectGitHub}
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl hover:shadow-purple-500/25"
                >
                  Reconnect GitHub
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAndSortedRepos.map((repo, index) => (
                <div
                  key={repo.id}
                  className="group bg-gradient-to-br from-slate-800/50 to-purple-800/20 rounded-2xl p-6 border border-slate-700/50 hover:border-purple-400/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/25"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  {/* Repository Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-white truncate group-hover:text-purple-200 transition-colors duration-200">
                        {repo.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        {repo.private ? (
                          <span className="inline-flex items-center gap-1 bg-red-500/20 text-red-300 text-xs px-2 py-1 rounded-full">
                            <svg
                              className="w-3 h-3"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                            </svg>
                            Private
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-green-500/20 text-green-300 text-xs px-2 py-1 rounded-full">
                            <svg
                              className="w-3 h-3"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 2A10 10 0 002 12a10 10 0 0010 10 10 10 0 0010-10A10 10 0 0012 2z" />
                            </svg>
                            Public
                          </span>
                        )}
                        {repo.fork && (
                          <span className="inline-flex items-center gap-1 bg-blue-500/20 text-blue-300 text-xs px-2 py-1 rounded-full">
                            <svg
                              className="w-3 h-3"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M8 2v4h8V2h2v4h2v2H2V6h2V2h4zm0 18v-4H6v-2h12v2h-2v4h-2v-4H8v4H6z" />
                            </svg>
                            Fork
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-300 text-sm mb-6 leading-relaxed line-clamp-3">
                    {repo.description ||
                      "No description available for this repository."}
                  </p>

                  {/* Repository Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-400 mb-6">
                    <div className="flex items-center gap-4">
                      {repo.language && (
                        <span className="flex items-center gap-2">
                          <span
                            className={`w-3 h-3 rounded-full ${getLanguageColor(
                              repo.language
                            )}`}
                          ></span>
                          {repo.language}
                        </span>
                      )}
                      {repo.stargazers_count > 0 && (
                        <span className="flex items-center gap-1">
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                          {repo.stargazers_count}
                        </span>
                      )}
                    </div>
                    <span className="text-xs">
                      Updated {new Date(repo.updated_at).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-slate-700/50 hover:bg-slate-600/50 px-4 py-3 rounded-lg text-sm font-medium text-center transition-all duration-200 hover:text-white border border-slate-600 hover:border-slate-500"
                    >
                      View on GitHub
                    </a>
                    <button
                      onClick={() =>
                        router.push(
                          `/analyze?repo=${encodeURIComponent(repo.html_url)}`
                        )
                      }
                      className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-purple-500/25"
                    >
                      Generate Docs
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
