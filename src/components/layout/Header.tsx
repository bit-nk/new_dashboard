"use client";

import { Search, ChevronDown, User, Key, SlidersHorizontal, LogOut, ArrowRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect, useCallback } from "react";
import { searchItems, SearchItem } from "@/data/searchIndex";

const navItems = [
  { label: "Dashboard", href: "/" },
  { label: "System Status", href: "/system-status" },
  { label: "Performance", href: "/performance" },
  { label: "API Logs", href: "/api-logs" },
  { label: "Settings", href: "/settings" },
];

const userMenuItems = [
  {
    key: "profile",
    label: "Profile",
    description: "Account & role info",
    icon: User,
    href: "/profile",
  },
  {
    key: "api-keys",
    label: "API Keys",
    description: "Manage access tokens",
    icon: Key,
    href: "/api-keys",
  },
  {
    key: "preferences",
    label: "Preferences",
    description: "Theme, timezone, display",
    icon: SlidersHorizontal,
    href: "/preferences",
  },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = searchItems(searchQuery);
  const showDropdown = searchFocused && searchQuery.trim().length > 0;

  const navigateTo = useCallback(
    (item: SearchItem) => {
      router.push(item.href);
      setSearchQuery("");
      setSearchFocused(false);
      setSelectedIndex(-1);
      inputRef.current?.blur();
    },
    [router]
  );

  // Close user menu on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  // Close user menu on Escape
  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    if (menuOpen) {
      document.addEventListener("keydown", handleEsc);
    }
    return () => document.removeEventListener("keydown", handleEsc);
  }, [menuOpen]);

  // Close search dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
        setSelectedIndex(-1);
      }
    }
    if (searchFocused) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchFocused]);

  // Keyboard navigation for search results
  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === "Enter" && selectedIndex >= 0 && results[selectedIndex]) {
      e.preventDefault();
      navigateTo(results[selectedIndex]);
    } else if (e.key === "Escape") {
      setSearchFocused(false);
      setSelectedIndex(-1);
      inputRef.current?.blur();
    }
  };

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(-1);
  }, [searchQuery]);

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 transition-colors duration-200">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 flex items-center justify-between h-14 sm:h-16">
        {/* Hamburger (mobile only) */}
        <button
          onClick={() => setMobileNavOpen((prev) => !prev)}
          className="md:hidden p-2 -ml-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileNavOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Logo */}
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-teal-800 dark:bg-teal-600 rounded-lg" />
        </div>

        {/* Search */}
        <div className="flex-1 max-w-lg mx-3 sm:mx-8 relative hidden sm:block" ref={searchRef}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search pages, metrics, settings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onKeyDown={handleSearchKeyDown}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          {/* Search dropdown */}
          {showDropdown && (
            <div className="absolute left-0 right-0 top-full mt-1.5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden z-50">
              {results.length > 0 ? (
                <ul className="py-1.5">
                  {results.map((item, i) => (
                    <li key={`${item.label}-${item.page}`}>
                      <button
                        onMouseDown={(e) => {
                          e.preventDefault();
                          navigateTo(item);
                        }}
                        onMouseEnter={() => setSelectedIndex(i)}
                        className={`flex items-center justify-between w-full px-4 py-2.5 text-left transition-colors ${
                          i === selectedIndex
                            ? "bg-teal-50 dark:bg-teal-900/30"
                            : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <Search size={14} className="text-gray-400 flex-shrink-0" />
                          <span className={`text-sm truncate ${
                            i === selectedIndex
                              ? "text-teal-700 dark:text-teal-300 font-medium"
                              : "text-gray-700 dark:text-gray-200"
                          }`}>
                            {item.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                          <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${
                            i === selectedIndex
                              ? "bg-teal-100 dark:bg-teal-800/50 text-teal-600 dark:text-teal-300"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                          }`}>
                            {item.page}
                          </span>
                          {i === selectedIndex && (
                            <ArrowRight size={12} className="text-teal-500 dark:text-teal-400" />
                          )}
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-4 py-6 text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">No results found</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Try searching for a metric, page, or setting</p>
                </div>
              )}

              {/* Keyboard hint */}
              {results.length > 0 && (
                <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-700 flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 text-[10px] font-medium bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded border border-gray-200 dark:border-gray-600">&uarr;</kbd>
                    <kbd className="px-1.5 py-0.5 text-[10px] font-medium bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded border border-gray-200 dark:border-gray-600">&darr;</kbd>
                    <span className="text-[10px] text-gray-400 ml-0.5">navigate</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 text-[10px] font-medium bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded border border-gray-200 dark:border-gray-600">Enter</kbd>
                    <span className="text-[10px] text-gray-400 ml-0.5">go</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 text-[10px] font-medium bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded border border-gray-200 dark:border-gray-600">Esc</kbd>
                    <span className="text-[10px] text-gray-400 ml-0.5">close</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? "text-gray-900 dark:text-white border-b-2 border-gray-900 dark:border-white"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User Avatar + Dropdown */}
        <div className="relative ml-4" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="flex items-center gap-2 rounded-full pr-1 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            aria-expanded={menuOpen}
            aria-haspopup="true"
          >
            <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 border-2 border-orange-400 flex items-center justify-center">
              <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <ChevronDown
              size={14}
              className={`text-gray-400 transition-transform duration-200 ${menuOpen ? "rotate-180" : ""}`}
            />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg py-2 z-50">
              {/* User info header */}
              <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center">
                    <span className="text-teal-700 dark:text-teal-300 font-semibold text-sm">AD</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">Admin User</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">admin@crushbank.com</p>
                  </div>
                </div>
                <div className="mt-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-teal-50 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-700">
                    Administrator
                  </span>
                </div>
              </div>

              {/* Menu items */}
              <div className="py-1">
                {userMenuItems.map((item) => (
                  <Link
                    key={item.key}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center group-hover:bg-teal-50 dark:group-hover:bg-teal-900/40 transition-colors">
                      <item.icon size={15} className="text-gray-500 dark:text-gray-400 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white">{item.label}</p>
                      <p className="text-[11px] text-gray-400">{item.description}</p>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Logout */}
              <div className="border-t border-gray-100 dark:border-gray-700 pt-1">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    console.log("Logout clicked");
                  }}
                  className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center group-hover:bg-red-100 dark:group-hover:bg-red-900/40 transition-colors">
                    <LogOut size={15} className="text-gray-500 dark:text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-red-600 dark:group-hover:text-red-400">Log Out</p>
                    <p className="text-[11px] text-gray-400">End your session</p>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {mobileNavOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          {/* Mobile search */}
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700" ref={searchRef}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search pages, metrics, settings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onKeyDown={handleSearchKeyDown}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>

          <nav className="px-2 py-2 space-y-0.5">
            {navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileNavOpen(false)}
                  className={`block px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? "bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
