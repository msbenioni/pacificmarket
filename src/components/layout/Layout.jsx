"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createPageUrl } from "@/utils";
import { pacificMarket } from "@/lib/pacificMarketClient";
import { Search, User, Menu, X, ChevronDown, LogOut, Settings, CreditCard, AlertCircle, AlertTriangle, Home } from "lucide-react";
import * as AuthContext from "@/lib/AuthContext";

export default function Layout({ children, currentPageName }) {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    pacificMarket.auth.me().then(setUser).catch(() => setUser(null));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (page) => currentPageName === page;

  const navLinks = [
    { label: "Registry", page: "Registry" },
    { label: "Insights", page: "Insights" },
    { label: "About", page: "About" },
    { label: "Pricing", page: "Pricing" },
  ];

  const isHome = currentPageName === "Home";
  const isTransparent = scrollPosition <= 20;

  return (
    <div className="min-h-screen flex flex-col">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        body { font-family: 'Inter', sans-serif; }
      `}</style>

      {/* Header */}
      
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isTransparent
          ? 'bg-transparent'
          : 'bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href={createPageUrl("Home")} className="flex items-center gap-3 group">
              <img src="/pm_logo.png" alt="Pacific Market Registry" className="h-12 w-12" />
              <div className="flex flex-col items-center leading-none text-center">
                <span className={`text-lg font-bold tracking-[0.35em] ${
                  isTransparent ? "text-white" : "text-[#0a1628]"
                }`} style={{ fontFamily: "'Cinzel', serif" }}>
                  PACIFIC
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="h-px w-6 bg-[#c9a84c]" />
                  <span className="text-[#c9a84c] text-[0.65rem] font-bold tracking-[0.45em]" style={{ fontFamily: "'Cinzel', serif" }}>
                    MARKET
                  </span>
                  <span className="h-px w-6 bg-[#c9a84c]" />
                </div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map(link => (
                <Link
                  key={link.page}
                  href={createPageUrl(link.page)}
                  className={`text-sm font-medium transition-colors ${
                    isActive(link.page)
                      ? isTransparent ? "text-white" : "text-[#0d4f4f]"
                      : isTransparent ? "text-white/90 hover:text-white" : "text-gray-500 hover:text-[#0a1628]"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                href={createPageUrl("Registry")}
                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                  isTransparent
                    ? "bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
                    : "bg-[#0a1628] text-white hover:bg-[#0a1628]/90"
                }`}
              >
                <Search className="w-4 h-4" />
                Search
              </Link>
              <Link
                href={createPageUrl("ApplyListing")}
                className={`text-sm font-semibold px-4 py-2 rounded-lg transition-all ${
                  isTransparent
                    ? "text-white border-white/50 hover:bg-white/10"
                    : "text-[#0d4f4f] border border-[#0d4f4f] hover:bg-[#0d4f4f] hover:text-white"
                }`}
              >
                Submit a Business
              </Link>
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                      isTransparent
                        ? "bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
                        : "bg-[#0a1628] text-white hover:bg-[#0a1628]/90"
                    }`}
                  >
                    <User className="w-4 h-4" />
                    {user.full_name?.split(" ")[0] || "Account"}
                    <ChevronDown className="w-3 h-3" />
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50">
                      <Link href={createPageUrl("CustomerPortal")} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setUserMenuOpen(false)}>
                        <Home className="w-4 h-4" /> My Portal
                      </Link>
                      <Link href={createPageUrl("AdminDashboard")} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setUserMenuOpen(false)}>
                        <Settings className="w-4 h-4" /> Admin
                      </Link>
                      <hr className="my-1 border-gray-100" />
                      <button onClick={() => pacificMarket.auth.logout()} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : null}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`md:hidden p-2 rounded-lg transition-colors ${
                isTransparent
                  ? "text-white hover:text-white/80"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className={`md:hidden border-t px-4 py-4 space-y-3 ${
            isTransparent
              ? "bg-white/95 backdrop-blur-sm border-white/20"
              : "bg-white border-gray-100"
          }`}>
            {navLinks.map(link => (
              <Link key={link.page} href={createPageUrl(link.page)} className="block text-sm font-medium text-gray-700 py-2" onClick={() => setMenuOpen(false)}>
                {link.label}
              </Link>
            ))}
            <Link href={createPageUrl("ApplyListing")} className="block text-sm font-semibold text-[#0d4f4f] py-2" onClick={() => setMenuOpen(false)}>Submit a Business</Link>
            {user ? (
              <>
                <Link href={createPageUrl("CustomerPortal")} className="block text-sm font-medium text-gray-700 py-2" onClick={() => setMenuOpen(false)}>My Portal</Link>
                <button onClick={() => pacificMarket.auth.logout()} className="block text-sm font-medium text-red-600 py-2">Sign Out</button>
              </>
            ) : null}
          </div>
        )}
      </header>

      {/* Main Content */}
      
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      
      <footer className="bg-[#0a1628] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <img src="/pm_logo.png" alt="Pacific Market Registry" className="h-12 w-12" />
                <div className="flex flex-col items-center leading-none text-center">
                  <span className="text-white text-lg font-bold tracking-[0.35em]" style={{ fontFamily: "'Cinzel', serif" }}>
                    PACIFIC
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="h-px w-6 bg-[#c9a84c]" />
                    <span className="text-[#c9a84c] text-[0.65rem] font-bold tracking-[0.45em]" style={{ fontFamily: "'Cinzel', serif" }}>
                      MARKET
                    </span>
                    <span className="h-px w-6 bg-[#c9a84c]" />
                  </div>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                The authoritative global registry for Pacific-owned businesses. Preserving cultural integrity through structured data governance.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-sm uppercase tracking-wider text-gray-300 mb-4">Registry</h4>
              <ul className="space-y-2">
                {[["Registry", "Search Registry"], ["ApplyListing", "Submit a Business"], ["Pricing", "Plans & Pricing"], ["About", "About"]].map(([page, label]) => (
                  <li key={page}><Link href={createPageUrl(page)} className="text-gray-400 text-sm hover:text-white transition-colors">{label}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm uppercase tracking-wider text-gray-300 mb-4">Account</h4>
              <ul className="space-y-2">
                {[
                  ["CustomerPortal", "Business Portal"],
                  ["AdminDashboard", "Admin Dashboard"]
                ].map(([page, label]) => (
                  <li key={page}><Link href={createPageUrl(page)} className="text-gray-400 text-sm hover:text-white transition-colors">{label}</Link></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-xs"> 2026 Pacific Market Registry. All rights reserved.</p>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-[#00c4cc] animate-pulse"></div>
              <span className="text-gray-500 text-xs">Registry Operational</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}