"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { LogOut, Heart, ChevronRight } from "react-feather";
import { getAttractions } from "@/lib/api";
import { useSavedLocations } from "@/lib/useSavedLocations";
import { getCategories } from "@/utils/categorize";

type RecentLikedItem = {
  id: number;
  title: string;
  imageUrl: string | null;
  categories: string[];
};

const categoryStyles: Record<string, string> = {
  "Arts & Museum": "bg-purple-500/10 text-purple-300 border-purple-500/20",
  "Culture & Heritage": "bg-amber-500/10 text-amber-300 border-amber-500/20",
  "Nature & Parks": "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  Architecture: "bg-blue-500/10 text-blue-300 border-blue-500/20",
  Lifestyle: "bg-pink-500/10 text-pink-300 border-pink-500/20",
  Landmark: "bg-slate-500/10 text-slate-300 border-slate-500/20",
};

export default function Navbar() {
  const { user, loading, signOut } = useAuth();
  const pathname = usePathname();
  const isLoggedIn = !!user;
  const [isHeartMenuOpen, setIsHeartMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [attractions, setAttractions] = useState<RecentLikedItem[]>([]);
  const [isHeartLoading, setIsHeartLoading] = useState(false);
  const [heartError, setHeartError] = useState<string | null>(null);
  const heartMenuRef = useRef<HTMLDivElement | null>(null);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);
  const { savedOrder } = useSavedLocations(user?.id ?? null, isLoggedIn);
  const username =
    typeof user?.user_metadata?.username === "string" &&
    user.user_metadata.username.trim().length > 0
      ? user.user_metadata.username.trim()
      : user?.email?.split("@")[0] ?? "User";
  const email = user?.email ?? "";
  const attractionLookup = useMemo(
    () => new Map(attractions.map((item) => [item.id, item])),
    [attractions]
  );
  const recentLikedItems = useMemo(
    () =>
      savedOrder
        .map((id) => attractionLookup.get(id))
        .filter((item): item is RecentLikedItem => Boolean(item)),
    [attractionLookup, savedOrder]
  );

  const navLinkClass = (path: string) =>
    `relative inline-flex items-center pb-1 text-base font-medium transition-colors ${
      pathname === path
        ? "text-slate-900 after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:rounded-full after:bg-slate-900"
        : "text-gray-600 hover:text-slate-900 after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:origin-center after:scale-x-0 after:rounded-full after:bg-slate-900 after:transition-transform after:duration-200 hover:after:scale-x-100"
    }`;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!heartMenuRef.current?.contains(event.target as Node)) {
        setIsHeartMenuOpen(false);
      }

      if (!profileMenuRef.current?.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setIsHeartMenuOpen(false);
    setIsProfileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isLoggedIn || !isHeartMenuOpen || attractions.length > 0) {
      return;
    }

    let cancelled = false;

    async function fetchRecentLikedItems() {
      setIsHeartLoading(true);
      setHeartError(null);

      try {
        const data = await getAttractions();

        if (cancelled) {
          return;
        }

        const normalized = (data as any[])
          .map((item) => {
            const id = Number(item?.properties?.OBJECTID_1);

            if (!Number.isFinite(id)) {
              return null;
            }

            return {
              id,
              title: item?.properties?.PAGETITLE || "Untitled location",
              imageUrl: item?.imageUrl ?? null,
              categories: getCategories(item),
            };
          })
          .filter((item): item is RecentLikedItem => Boolean(item));

        setAttractions(normalized);
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to load recent liked items:", error);
          setHeartError("Failed to load liked items.");
        }
      } finally {
        if (!cancelled) {
          setIsHeartLoading(false);
        }
      }
    }

    fetchRecentLikedItems();

    return () => {
      cancelled = true;
    };
  }, [attractions.length, isHeartMenuOpen, isLoggedIn]);

  return (
    <nav className="sticky top-0 z-[9999] border-b border-gray-100 bg-white shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Left: Logo + Nav links */}
        <div className="flex min-w-0 items-center gap-5 sm:gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <img src="/Frame.png" alt="Trippa Logo" className="w-6 h-6" />
            <span className="text-base font-semibold text-blue-600">
              Trippa
            </span>
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-4 sm:gap-6">
            <Link href="/map" className={navLinkClass("/map")}>
              Map
            </Link>
            <Link href="/location" className={navLinkClass("/location")}>
              Location
            </Link>
            {isLoggedIn && (
              <Link href="/saved" className={navLinkClass("/saved")}>
                Saved
              </Link>
            )}
          </div>
        </div>

        {/* Right: Auth area — hidden while loading to prevent flash */}
        {!loading && (
          <div className="flex shrink-0 items-center gap-3 sm:gap-4">
            {isLoggedIn ? (
              <>
                <div ref={heartMenuRef} className="relative">
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      setIsHeartMenuOpen((open) => !open);
                    }}
                    className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
                      isHeartMenuOpen
                        ? "bg-red-50 text-red-500"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                    }`}
                    aria-label="Recently liked"
                    title="Recently liked"
                  >
                    <Heart
                      size={22}
                      className={savedOrder.length > 0 ? "fill-current" : ""}
                    />
                  </button>

                  {isHeartMenuOpen && (
                    <>
                      <div className="absolute right-3.5 top-[calc(100%+4px)] z-[10001] h-3 w-3 rotate-45 border-l border-t border-slate-200 bg-white" />
                      <div className="absolute right-0 top-[calc(100%+12px)] z-[10000] w-[400px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.15)] animate-in fade-in zoom-in-95 duration-200">
                        <div className="bg-slate-50/50 border-b border-slate-100 px-6 py-4 flex justify-between items-center">
                          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                            Recently Liked
                          </h3>
                          <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
                            {savedOrder.length}
                          </span>
                        </div>

                        <div className="max-h-[380px] overflow-y-auto p-3 space-y-2">
                          {isHeartLoading ? (
                            <div className="p-8 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                              Loading...
                            </div>
                          ) : recentLikedItems.length === 0 ? (
                            <div className="p-8 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                              No favorites yet
                            </div>
                          ) : (
                            recentLikedItems.map((item) => (
                              <Link
                                key={item.id}
                                href={`/location?selectedId=${item.id}`}
                                className="group flex items-center gap-3 p-2 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100"
                              >
                                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                                  {item.imageUrl && (
                                    <img
                                      src={item.imageUrl}
                                      className="h-full w-full object-cover group-hover:scale-110 transition-transform"
                                    />
                                  )}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-[16px] font-black italic tracking-tighter text-slate-900">
                                    {item.title}
                                  </p>
                                  <div className="flex gap-1 mt-1">
                                    {item.categories.slice(0, 1).map((cat) => (
                                      <span
                                        key={cat}
                                        className={`text-[10px] font-black px-2 py-0.5 rounded-md border uppercase ${
                                          categoryStyles[cat] ||
                                          categoryStyles.Landmark
                                        }`}
                                      >
                                        {cat}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                                <ChevronRight
                                  size={14}
                                  className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all"
                                />
                              </Link>
                            ))
                          )}
                        </div>
                        <Link
                          href="/saved"
                          className="block w-full py-4 text-center text-[13px] font-black tracking-[0.2em] bg-slate-50 text-slate-400 hover:text-slate-900 border-t border-slate-100"
                        >
                          View All Saved
                        </Link>
                      </div>
                    </>
                  )}
                </div>

                <div ref={profileMenuRef} className="relative">
                  <button
                    onClick={() => {
                      setIsHeartMenuOpen(false);
                      setIsProfileMenuOpen((open) => !open);
                    }}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-400 text-gray-500 transition-colors hover:border-gray-600 hover:text-gray-800"
                    aria-label="Profile"
                    title="Profile"
                  >
                    <svg
                      width="18"
                      height="18"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </button>

                  {isProfileMenuOpen && (
                    <div className="absolute right-0 top-full mt-3 w-64 rounded-2xl border border-gray-100 bg-white p-2 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                      <div className="px-4 py-3 border-b border-gray-50">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">
                          Authenticated as
                        </p>
                        <p className="text-sm font-bold text-slate-900 truncate">
                          {username}
                        </p>
                        <p className="text-[11px] text-gray-500 truncate">
                          {email}
                        </p>
                      </div>

                      <div className="p-1">
                        <button
                          onClick={async (e) => {
                            // 1. Stop the dropdown from closing prematurely
                            e.preventDefault();
                            e.stopPropagation();

                            try {
                              // 2. Perform the sign out FIRST
                              await signOut();

                              // 3. ONLY close the menu after the sign out is successful
                              setIsProfileMenuOpen(false);
                            } catch (error) {
                              console.error("Sign out failed:", error);
                              // Optional: keep menu open or show error if sign out fails
                            }
                          }}
                          className="flex items-center gap-3 w-full rounded-xl px-4 py-3 text-left text-sm font-bold text-red-600 transition-colors hover:bg-red-50 relative z-[60]"
                        >
                          <LogOut size={16} />
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  href={`/login?returnTo=${encodeURIComponent(pathname)}`}
                  className="text-sm font-medium text-gray-700 transition-colors hover:text-gray-900"
                >
                  Log in
                </Link>
                <Link
                  href={`/signup?returnTo=${encodeURIComponent(pathname)}`}
                  className="rounded bg-blue-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}