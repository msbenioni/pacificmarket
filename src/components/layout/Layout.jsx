"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createPageUrl } from "@/utils";
import {
  Menu,
  X,
  ChevronDown,
  User,
  LogOut,
  Home,
  Shield,
} from "lucide-react";
import CookieConsent from "../shared/CookieConsent";

export default function Layout({ children, currentPageName }) {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { getSupabase } = await import("@/lib/supabase/client");
        const supabase = getSupabase();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          let profileData = null;

          try {
            const { data } = await supabase
              .from("profiles")
              .select("role, display_name")
              .eq("id", user.id)
              .single();

            profileData = data;
          } catch (profileError) {
            console.log("Profile not found for new user:", user.id);
          }

          const enhancedUser = {
            ...user,
            role: profileData?.role || "owner",
            display_name:
              profileData?.display_name ||
              user.user_metadata?.display_name ||
              user.user_metadata?.full_name ||
              user.email?.split("@")[0] ||
              "User",
          };

          setUser(enhancedUser);
        } else {
          setUser(null);
        }
      } catch (error) {
        setUser(null);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      const { getSupabase } = await import("@/lib/supabase/client");
      const supabase = getSupabase();
      await supabase.auth.signOut();
      setUser(null);
      setUserMenuOpen(false);
      router.push(createPageUrl("Home"));
    } catch (error) {
      console.error("Logout error:", error);
      setUser(null);
      setUserMenuOpen(false);
      router.push(createPageUrl("Home"));
    }
  };

  const isActive = (page) => currentPageName === page;
  const isTransparent = scrollPosition <= 20;

  const navLinks = [
    { label: "Pacific Businesses", page: "PacificBusinesses" },
    { label: "Tools", page: "Tools" },
    { label: "About", page: "About" },
    { label: "Pricing", page: "Pricing" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        body { font-family: 'Inter', sans-serif; }
      `}</style>

      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isTransparent
            ? "bg-transparent"
            : "bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href={createPageUrl("Home")} className="flex items-center group">
              <Image
                src={isTransparent ? "/pm_logo.png" : "/pm_logo_dark.png"}
                alt="Pacific Discovery Network"
                width={160}
                height={64}
                className="h-16 w-40 transition-opacity duration-300"
                priority={false}
              />
            </Link>

            <div className="flex items-center gap-4 lg:gap-8">
              {/* Desktop Nav */}
              <nav className="hidden lg:flex items-center gap-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.page}
                    href={createPageUrl(link.page)}
                    className={`text-sm font-medium transition-colors ${
                      isActive(link.page)
                        ? isTransparent
                          ? "text-white"
                          : "text-[#0d4f4f]"
                        : isTransparent
                        ? "text-white/90 hover:text-white"
                        : "text-gray-500 hover:text-[#0a1628]"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {/* Actions */}
              <div className="hidden md:flex items-center gap-3">
                {!user && (
                  <Link
                    href={createPageUrl("BusinessLogin")}
                    className={`text-sm font-medium px-4 py-2 rounded-lg transition-all ${
                      isTransparent
                        ? "text-white border border-white/50 hover:bg-white/10"
                        : "text-gray-600 border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    Login
                  </Link>
                )}

                {!user && (
                  <Link
                    href={`${createPageUrl("BusinessLogin")}?mode=signup`}
                    className={`text-sm font-semibold px-4 py-2 rounded-lg transition-all ${
                      isTransparent
                        ? "text-white border border-white/50 hover:bg-white/10"
                        : "text-[#0d4f4f] border border-[#0d4f4f] hover:bg-[#0d4f4f] hover:text-white"
                    }`}
                  >
                    Join the Network
                  </Link>
                )}

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
                      {user.display_name?.split(" ")[0] || "Account"}
                      <ChevronDown className="w-3 h-3" />
                    </button>

                    {userMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50">
                        {user?.role === "owner" && (
                          <Link
                            href={createPageUrl("BusinessPortal")}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <Home className="w-4 h-4" />
                            Business Portal
                          </Link>
                        )}

                        <Link
                          href={createPageUrl("ProfileSettings")}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <User className="w-4 h-4" />
                          Profile Settings
                        </Link>

                        {user?.role === "admin" && (
                          <Link
                            href={createPageUrl("AdminDashboard")}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <Shield className="w-4 h-4" />
                            Admin Dashboard
                          </Link>
                        )}

                        <hr className="my-1 border-gray-100" />

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                ) : null}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className={`lg:hidden p-2 rounded-lg transition-colors ${
                  isTransparent
                    ? "text-white hover:text-white/80"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div
            className={`md:hidden border-t px-4 py-4 space-y-3 ${
              isTransparent
                ? "bg-white/95 backdrop-blur-sm border-white/20"
                : "bg-white border-gray-100"
            }`}
          >
            {navLinks.map((link) => (
              <Link
                key={link.page}
                href={createPageUrl(link.page)}
                className="block text-sm font-medium text-gray-700 py-2"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {!user && (
              <Link
                href={createPageUrl("BusinessLogin")}
                className="block text-sm font-medium text-gray-600 py-2"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
            )}

            {user?.role === "owner" && (
              <Link
                href={createPageUrl("BusinessPortal")}
                className="block text-sm font-semibold text-[#0d4f4f] py-2"
                onClick={() => setMenuOpen(false)}
              >
                Business Portal
              </Link>
            )}

            {user && (
              <Link
                href={createPageUrl("ProfileSettings")}
                className="block text-sm font-medium text-gray-700 py-2"
                onClick={() => setMenuOpen(false)}
              >
                Profile Settings
              </Link>
            )}

            {!user ? (
              <Link
                href={`${createPageUrl("BusinessLogin")}?mode=signup`}
                className="block text-sm font-semibold text-[#0d4f4f] py-2"
                onClick={() => setMenuOpen(false)}
              >
                Join the Network
              </Link>
            ) : user?.role === "admin" ? (
              <Link
                href={createPageUrl("AdminDashboard")}
                className="block text-sm font-semibold text-[#0d4f4f] py-2"
                onClick={() => setMenuOpen(false)}
              >
                Admin Dashboard
              </Link>
            ) : null}

            {user ? (
              <button
                onClick={handleLogout}
                className="block text-sm font-medium text-red-600 py-2"
              >
                Sign Out
              </button>
            ) : null}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-[#0a1628] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
          {/* Mobile */}
          <div className="sm:hidden space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <Link href={createPageUrl("Home")} className="inline-block">
                  <Image
                    src="/pm_logo.png"
                    alt="Pacific Discovery Network"
                    width={120}
                    height={48}
                    className="h-10 w-auto"
                    priority={false}
                  />
                </Link>

                <p className="mt-2 text-[11px] leading-5 text-gray-400 max-w-[240px]">
                  Discovering, connecting with, and supporting Pacific-owned businesses.
                </p>
              </div>

              <div className="flex items-center gap-1 shrink-0 pt-1">
                <div className="w-2 h-2 rounded-full bg-[#00c4cc] animate-pulse" />
                <span className="text-[11px] text-gray-500">Live</span>
              </div>
            </div>

            <div className="divide-y divide-white/10 rounded-xl border border-white/10 overflow-hidden bg-white/5">
              <details className="group">
                <summary className="list-none cursor-pointer px-4 py-3 flex items-center justify-between text-sm font-medium text-white">
                  <span>Legal</span>
                  <ChevronDown className="w-4 h-4 text-gray-400 transition-transform group-open:rotate-180" />
                </summary>
                <div className="px-4 pb-3 grid grid-cols-2 gap-x-4 gap-y-2">
                  {[
                    ["Terms", "Terms"],
                    ["Privacy", "Privacy"],
                    ["Cookies", "Cookies"],
                    ["Data", "Data Protection"],
                    ["Accessibility", "Accessibility"],
                  ].map(([page, label]) => (
                    <Link
                      key={page}
                      href={createPageUrl(page)}
                      className="text-[12px] text-gray-400 hover:text-white transition-colors"
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              </details>

              <details className="group">
                <summary className="list-none cursor-pointer px-4 py-3 flex items-center justify-between text-sm font-medium text-white">
                  <span>Support</span>
                  <ChevronDown className="w-4 h-4 text-gray-400 transition-transform group-open:rotate-180" />
                </summary>
                <div className="px-4 pb-3 grid grid-cols-2 gap-x-4 gap-y-2">
                  {[
                    ["Contact", "Contact"],
                    ["Help", "Help Centre"],
                    ["Guidelines", "Guidelines"],
                  ].map(([page, label]) => (
                    <Link
                      key={page}
                      href={createPageUrl(page)}
                      className="text-[12px] text-gray-400 hover:text-white transition-colors"
                    >
                      {label}
                    </Link>
                  ))}
                  <Link
                    href={createPageUrl("AdminLogin")}
                    className="text-[12px] text-gray-400 hover:text-white transition-colors"
                  >
                    Admin
                  </Link>
                </div>
              </details>
            </div>

            <div className="pt-1">
              <p className="text-[11px] text-gray-500 leading-4">
                &copy; 2026 Pacific Discovery Network. All rights reserved.
              </p>
            </div>
          </div>

          {/* Desktop / tablet */}
          <div className="hidden sm:block">
            <div className="grid sm:grid-cols-4 gap-8">
              <div className="sm:col-span-2">
                <Link href={createPageUrl("Home")} className="inline-block">
                  <div className="flex items-center gap-3 mb-3 hover:opacity-80 transition-opacity">
                    <Image
                      src="/pm_logo.png"
                      alt="Pacific Discovery Network"
                      width={120}
                      height={48}
                      className="h-12 w-30 sm:h-16 sm:w-40"
                      priority={false}
                    />
                  </div>
                </Link>

                <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                  Pacific Discovery Network is a premium platform for discovering,
                  connecting with, and supporting Pacific-owned businesses across
                  regions, industries, and communities.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-sm uppercase tracking-wider text-gray-300 mb-3">
                  Legal
                </h4>
                <ul className="space-y-2">
                  {[
                    ["Terms", "Terms & Conditions"],
                    ["Privacy", "Privacy Policy"],
                    ["Cookies", "Cookie Policy"],
                    ["Data", "Data Protection"],
                    ["Accessibility", "Accessibility"],
                  ].map(([page, label]) => (
                    <li key={page}>
                      <Link
                        href={createPageUrl(page)}
                        className="text-gray-400 text-sm hover:text-white transition-colors"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-sm uppercase tracking-wider text-gray-300 mb-3">
                  Support
                </h4>
                <ul className="space-y-2">
                  {[
                    ["Contact", "Contact Us"],
                    ["Help", "Help Centre"],
                    ["Guidelines", "Community Guidelines"],
                  ].map(([page, label]) => (
                    <li key={page}>
                      <Link
                        href={createPageUrl(page)}
                        className="text-gray-400 text-sm hover:text-white transition-colors"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="border-t border-white/10 pt-6 mt-8">
              <div className="flex justify-between items-center gap-4">
                <p className="text-gray-500 text-xs">
                  &copy; 2026 Pacific Discovery Network. All rights reserved.
                </p>

                <div className="flex items-center gap-4">
                  <Link
                    href={createPageUrl("AdminLogin")}
                    className="text-gray-500 text-xs hover:text-gray-300 transition-colors"
                  >
                    Admin
                  </Link>

                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-[#00c4cc] animate-pulse"></div>
                    <span className="text-gray-500 text-xs">Discovery platform live</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <CookieConsent />
    </div>
  );
}