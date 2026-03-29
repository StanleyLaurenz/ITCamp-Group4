"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { LogOut, Heart } from "react-feather";
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
    [attractions],
  );
  const recentLikedItems = useMemo(
    () =>
      savedOrder
        .map((id) => attractionLookup.get(id))
        .filter((item): item is RecentLikedItem => Boolean(item)),
    [attractionLookup, savedOrder],
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
                    <div className="absolute right-0 top-full mt-3 w-[380px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                      <div className="border-b border-slate-200 px-6 py-4">
                        <p className="text-[13px] font-black tracking-tight text-slate-900 underline underline-offset-4">
                          Recently liked
                        </p>
                      </div>

                      {isHeartLoading ? (
                        <div className="px-6 py-8 text-sm text-slate-500">
                          Loading liked items...
                        </div>
                      ) : heartError ? (
                        <div className="px-6 py-8 text-sm font-medium text-red-500">
                          {heartError}
                        </div>
                      ) : recentLikedItems.length === 0 ? (
                        <div className="px-6 py-8 text-sm text-slate-500">
                          No liked locations yet.
                        </div>
                      ) : (
                        <div className="max-h-[360px] overflow-y-auto bg-slate-50/40 px-3 py-3">
                          {recentLikedItems.map((item, index) => (
                            <div
                              key={item.id}
                              className={`mb-3 overflow-hidden rounded-[24px] border border-slate-200 bg-white p-3 shadow-sm transition-shadow hover:shadow-md ${
                                index === recentLikedItems.length - 1 ? "mb-0" : ""
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <div className="min-w-0 flex-1 space-y-3">
                                  <p className="line-clamp-2 text-lg font-extrabold tracking-tight text-slate-900">
                                    {item.title}
                                  </p>
                                  <div className="flex flex-wrap gap-2">
                                    {item.categories.slice(0, 2).map((category) => (
                                      <span
                                        key={`${item.id}-${category}`}
                                        className={`px-2.5 py-0.5 rounded-full text-[9px] font-black tracking-widest uppercase border backdrop-blur-md transition-colors ${
                                          categoryStyles[category] || categoryStyles.Landmark
                                        }`}
                                      >
                                        {category}
                                      </span>
                                    ))}
                                  </div>
                                </div>

                                {item.imageUrl ? (
                                  <img
                                    src={item.imageUrl}
                                    alt={item.title}
                                    className="h-24 w-28 shrink-0 rounded-[20px] object-cover"
                                  />
                                ) : (
                                  <div className="flex h-24 w-28 shrink-0 items-center justify-center rounded-[20px] bg-slate-100 text-xs font-semibold text-slate-400">
                                    No image
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
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
