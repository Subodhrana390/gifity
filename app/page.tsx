"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../lib/store";
import { logout } from "../features/auth/authSlice";
import Head from "next/head";
import Link from "next/link";

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const [activeTab, setActiveTab] = useState("analysis");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [animatedNumber, setAnimatedNumber] = useState(0);

  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const userEmail = useSelector((state: RootState) => state.auth.user?.email);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);

    // Animate stats numbers
    const timer = setInterval(() => {
      setAnimatedNumber((prev) => (prev < 98 ? prev + 2 : 98));
    }, 50);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(timer);
    };
  }, []);

  const handleLogout = () => {
    // Note: Removed localStorage usage as per Claude artifacts restrictions
    dispatch(logout());
  };

  const features = [
    {
      id: "analysis",
      title: "Intelligent Code Analysis",
      description:
        "Advanced AI analyzes your repository structure, dependencies, and coding patterns to understand your project's architecture and purpose.",
      icon: "🧠",
      details: ["AST parsing", "Dependency mapping", "Pattern recognition"],
    },
    {
      id: "generation",
      title: "Smart Documentation Generation",
      description:
        "Generate comprehensive, contextually-aware documentation that includes API references, usage examples, and architectural overviews.",
      icon: "📚",
      details: ["API documentation", "Code examples", "Architecture diagrams"],
    },
    {
      id: "updates",
      title: "Automated Synchronization",
      description:
        "Keep documentation in perfect sync with your codebase through intelligent change detection and automated updates.",
      icon: "⚡",
      details: [
        "Real-time updates",
        "Change detection",
        "Version control integration",
      ],
    },
  ];

  const stats = [
    { number: "50K+", label: "Repositories Documented", suffix: "" },
    { number: `${animatedNumber}%`, label: "Time Saved", suffix: "" },
    { number: "10K+", label: "Developers", suffix: "" },
    { number: "99.9%", label: "Uptime", suffix: "" },
  ];

  const testimonials = [
    {
      quote:
        "GitDocify transformed how we approach documentation. What used to take days now happens automatically with better quality than we could write manually.",
      author: "Sarah Chen",
      role: "Lead Developer",
      company: "TechCorp",
      avatar: "👩‍💻",
    },
    {
      quote:
        "Our onboarding time for new developers dropped from weeks to days. The auto-generated docs are so comprehensive and accurate.",
      author: "Marcus Rodriguez",
      role: "Engineering Manager",
      company: "StartupXYZ",
      avatar: "👨‍💼",
    },
    {
      quote:
        "Finally, documentation that stays current with our rapid development cycle. GitDocify is a game-changer for agile teams.",
      author: "Dr. Lisa Wang",
      role: "CTO",
      company: "InnovateLab",
      avatar: "👩‍🔬",
    },
  ];

  const commands = [
    {
      command: "npx gitdocify init",
      description: "Initialize configuration and analyze repository structure",
      icon: "🚀",
    },
    {
      command: "gitdocify generate",
      description: "Generate comprehensive documentation from your codebase",
      icon: "📝",
    },
    {
      command: "gitdocify serve",
      description: "Preview documentation locally with live reload",
      icon: "👀",
    },
    {
      command: "gitdocify publish",
      description: "Deploy documentation to GitHub Pages or custom domain",
      icon: "🌐",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-x-hidden">
      <Head>
        <title>
          GitDocify - AI-Powered Documentation Generation for Developers
        </title>
        <meta
          name="description"
          content="Transform your repository into comprehensive, professional documentation automatically. Save 80% of documentation time with AI-powered analysis and generation."
        />
        <meta
          name="keywords"
          content="documentation, automation, AI, developer tools, API docs, code analysis"
        />
      </Head>

      {/* Enhanced Navigation */}
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-slate-900/95 backdrop-blur-lg border-b border-purple-500/20 shadow-lg shadow-purple-500/10"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 font-bold text-xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                GitDocify
              </div>
              <div className="hidden md:block ml-10">
                <div className="flex space-x-6">
                  {["Features", "How It Works", "Pricing", "Testimonials"].map(
                    (item) => (
                      <a
                        key={item}
                        href={`#${item.toLowerCase().replace(" ", "-")}`}
                        className="px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
                      >
                        {item}
                      </a>
                    )
                  )}
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6 space-x-4">
                <a
                  href="https://github.com/gitdocify/gitdocify"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  GitHub
                </a>
                {isLoggedIn ? (
                  <div className="flex items-center space-x-4">
                    <Link
                      href="/repositories"
                      className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-emerald-500/25"
                    >
                      My Repositories
                    </Link>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-sm font-bold">
                        {userEmail?.[0]?.toUpperCase()}
                      </div>
                      <span className="text-gray-300 text-sm max-w-32 truncate">
                        {userEmail}
                      </span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-4">
                    <Link
                      href="/login"
                      className="text-gray-300 hover:text-white transition-colors duration-200"
                    >
                      Sign In
                    </Link>
                  </div>
                )}
              </div>
            </div>
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200"
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-slate-900/95 backdrop-blur-lg border-t border-purple-500/20">
            <div className="px-4 pt-4 pb-6 space-y-3">
              {["Features", "How It Works", "Pricing", "Testimonials"].map(
                (item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase().replace(" ", "-")}`}
                    className="block px-4 py-3 rounded-lg text-base font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item}
                  </a>
                )
              )}
              <div className="pt-4 border-t border-gray-700">
                {!isLoggedIn ? (
                  <div className="space-y-3">
                    <Link
                      href="/login"
                      className="block w-full text-center px-4 py-3 rounded-lg text-base font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
                    >
                      Sign In
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Link
                      href="/repositories"
                      className="block w-full text-center px-4 py-3 rounded-lg text-base font-medium bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-200"
                    >
                      My Repositories
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-3 rounded-lg text-base font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Enhanced Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 mb-8">
            <span className="text-sm font-medium text-purple-200">
              ✨ AI-Powered Documentation
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
            <span className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
              Transform Code Into
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Professional Documentation
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-xl text-gray-300 leading-relaxed mb-12">
            Automatically generate comprehensive, developer-friendly
            documentation from your codebase using advanced AI analysis. Save
            80% of your documentation time while improving quality and
            consistency.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-16">
            <Link
              href="/analyze"
              className="group px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl hover:shadow-purple-500/25 flex items-center gap-2"
            >
              <span>Start Documenting</span>
              <svg
                className="w-5 h-5 transition-transform group-hover:translate-x-1"
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
            </Link>

            <a
              href="https://demo.gitdocify.com"
              className="px-8 py-4 border-2 border-gray-600 hover:border-purple-400 rounded-full text-lg font-semibold transition-all duration-300 hover:bg-white/5"
            >
              View Live Demo
            </a>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-gray-400 text-sm mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Problem Section */}
      <section className="py-20 bg-gradient-to-r from-slate-800/50 to-purple-800/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">
              Documentation Shouldn't Be a Bottleneck
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Every minute spent on manual documentation is a minute not spent
              on building amazing features.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-red-400">✕</span>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">
                    Outdated Documentation
                  </h3>
                  <p className="text-gray-400">
                    Code evolves fast, but documentation falls behind, creating
                    confusion for developers.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-red-400">✕</span>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">
                    Time-Consuming Process
                  </h3>
                  <p className="text-gray-400">
                    Manually writing and maintaining docs takes hours away from
                    actual development.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-red-400">✕</span>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">
                    Inconsistent Quality
                  </h3>
                  <p className="text-gray-400">
                    Different developers write docs differently, leading to
                    inconsistent user experience.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/80 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20">
              <div className="font-mono text-sm">
                <div className="text-purple-400 mb-4">
                  # Traditional approach
                </div>
                <div className="space-y-2 text-gray-300">
                  <div>📝 Write README manually</div>
                  <div>📝 Document each API endpoint</div>
                  <div>📝 Create usage examples</div>
                  <div>📝 Update on every change</div>
                  <div>📝 Review and maintain quality</div>
                </div>
                <div className="mt-6 text-red-400">
                  ⏱️ Result: Hours of work, prone to errors
                </div>

                <div className="border-t border-gray-700 mt-6 pt-6">
                  <div className="text-green-400 mb-4">
                    # GitDocify approach
                  </div>
                  <div className="text-blue-400">$ npx gitdocify generate</div>
                  <div className="mt-2 text-green-400">
                    ✅ Complete documentation generated
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">
              Powered by Advanced AI Analysis
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our intelligent system understands your code like a senior
              developer, generating documentation that's accurate,
              comprehensive, and maintainable.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.id}
                className={`group relative bg-gradient-to-br from-slate-800/50 to-purple-800/20 rounded-2xl p-8 border transition-all duration-500 hover:scale-105 cursor-pointer ${
                  activeTab === feature.id
                    ? "border-purple-400 shadow-xl shadow-purple-500/25"
                    : "border-slate-700/50 hover:border-purple-400/50"
                }`}
                onMouseEnter={() => setActiveTab(feature.id)}
                style={{
                  animationDelay: `${index * 200}ms`,
                }}
              >
                <div className="text-5xl mb-6 transition-transform duration-300 group-hover:scale-110">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  {feature.description}
                </p>
                <div className="space-y-2">
                  {feature.details.map((detail, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-sm text-purple-200"
                    >
                      <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                      {detail}
                    </div>
                  ))}
                </div>

                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Get Started Section */}
      <section
        id="how-it-works"
        className="py-20 bg-gradient-to-r from-slate-800/50 to-purple-800/20 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">
              Get Started in Under 60 Seconds
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              From installation to published documentation in less than a
              minute. No configuration files, no complex setup.
            </p>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20 max-w-5xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <span className="text-gray-400 text-sm">terminal</span>
              </div>

              <div className="font-mono text-sm space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-green-400">$</span>
                  <span className="text-white">npx gitdocify init</span>
                  <div className="ml-auto text-xs text-gray-500">
                    • Analyzes repository structure
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-400">$</span>
                  <span className="text-white">
                    gitdocify generate --publish
                  </span>
                  <div className="ml-auto text-xs text-gray-500">
                    • Generates & deploys docs
                  </div>
                </div>
                <div className="text-green-400 text-sm">
                  ✅ Documentation deployed to https://your-repo.github.io
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {commands.map((item, index) => (
                <div
                  key={index}
                  className="bg-slate-800/60 rounded-xl p-6 border border-slate-700 hover:border-purple-400/50 transition-all duration-300 group"
                >
                  <div className="text-3xl mb-3 transition-transform duration-300 group-hover:scale-110">
                    {item.icon}
                  </div>
                  <div className="font-mono text-purple-400 text-sm mb-2">
                    {item.command}
                  </div>
                  <div className="text-gray-400 text-xs leading-relaxed">
                    {item.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">
              Trusted by Developers Worldwide
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Join thousands of developers who have transformed their
              documentation workflow with GitDocify.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-slate-800/50 to-purple-800/20 rounded-2xl p-8 border border-slate-700/50 hover:border-purple-400/50 transition-all duration-300 hover:scale-105"
              >
                <div className="text-4xl mb-4">{testimonial.avatar}</div>
                <blockquote className="text-gray-300 italic mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>
                <div>
                  <div className="font-semibold text-white">
                    {testimonial.author}
                  </div>
                  <div className="text-purple-400 text-sm">
                    {testimonial.role}
                  </div>
                  <div className="text-gray-400 text-sm">
                    {testimonial.company}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        id="pricing"
        className="py-20 bg-gradient-to-r from-slate-800/50 to-purple-800/20 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Start free and scale as you grow. No hidden fees, no vendor lock-in.
          </p>

          <div className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full text-lg font-semibold mb-8">
            🎉 Always Free for Open Source Projects
          </div>

          <div className="max-w-md mx-auto">
            <a
              href="https://github.com/gitdocify/gitdocify"
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl hover:shadow-purple-500/25"
            >
              Get Started Free
            </a>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-slate-900 py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-6">
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  GitDocify
                </div>
              </div>
              <p className="text-gray-400 mb-6 max-w-md leading-relaxed">
                Transform your repositories into professional documentation
                automatically. Built by developers, for developers.
              </p>
              <div className="flex space-x-4">
                <a
                  href="https://github.com/gitdocify/gitdocify"
                  className="w-10 h-10 bg-slate-800 hover:bg-purple-600 rounded-full flex items-center justify-center transition-colors duration-200"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="https://twitter.com/gitdocify"
                  className="w-10 h-10 bg-slate-800 hover:bg-purple-600 rounded-full flex items-center justify-center transition-colors duration-200"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
                <a
                  href="https://discord.gg/gitdocify"
                  className="w-10 h-10 bg-slate-800 hover:bg-purple-600 rounded-full flex items-center justify-center transition-colors duration-200"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0190 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9460 2.4189-2.1568 2.4189Z" />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#features"
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing"
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="/docs"
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="/api"
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    API Reference
                  </a>
                </li>
                <li>
                  <a
                    href="/examples"
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    Examples
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="/about"
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="/blog"
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="/careers"
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="/contact"
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="/support"
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    Support
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-6 mb-4 md:mb-0">
                <p className="text-gray-400 text-sm">
                  © {new Date().getFullYear()} GitDocify. All rights reserved.
                </p>
                <div className="h-4 w-px bg-slate-700"></div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <span>Made with</span>
                  <span className="text-red-400">♥</span>
                  <span>for developers</span>
                </div>
              </div>
              <div className="flex space-x-6">
                <a
                  href="/privacy"
                  className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
                >
                  Privacy Policy
                </a>
                <a
                  href="/terms"
                  className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
                >
                  Terms of Service
                </a>
                <a
                  href="/cookies"
                  className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
                >
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
