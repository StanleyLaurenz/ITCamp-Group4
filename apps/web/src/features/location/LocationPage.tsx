"use client";

import { useEffect, useState, useRef } from "react"; // Added useRef
import { Filter } from "./Filter";
import { Search } from "./Search";
import { ChevronLeft, ChevronRight, Heart } from "react-feather"; // Added icons
import Link from "next/link";
import { LocationCard } from "./LocationCard";
import { getAttractions } from "../../lib/api";

export function LocationPage() {
  const [attractions, setAttractions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // 1. Create a reference to the scrollable div
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const toggleSave = (id: number) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  // 2. Scroll function
  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = 340; // Card width (320) + gap (24)

      current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getAttractions();
        setAttractions(data);
      } catch (error) {
        console.error("Failed to fetch data: ", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const savedLocations = attractions.filter((item) =>
    savedIds.includes(Number(item["properties"]["OBJECTID_1"]))
  );

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <div className="px-4 pt-16">
        <div className="max-w-[700px] mx-auto flex flex-row items-center gap-3 sm:gap-5">
          <div className="flex-grow">
            <Search />
          </div>
          <Filter />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 mt-12">
        {savedLocations.length > 0 && isLoggedIn && (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 relative group/section ">
            {/* Header */}
            <div className="flex justify-between items-center mb-6 px-2">
              <h2 className="text-2xl font-extrabold italic tracking-tighter text-slate-900">
                Saved Locations
              </h2>
              <Link
                href="/saved"
                className="flex items-center gap-2 text-sm font-bold text-[#1572D3] hover:text-[#125ba8] transition-colors bg-[#1572D3]/5 px-4 py-2 rounded-full"
              >
                View all ({savedLocations.length})
                <span className="transition-transform ">→</span>
              </Link>
            </div>

            {/* Left Button */}
            <button
              onClick={() => scroll("left")}
              className="absolute left-[0px] sm:left-[-20px] top-1/2 z-50 p-2 bg-white shadow-xl rounded-full border border-slate-200 opacity-0 group-hover/section:opacity-100 transition-opacity md:block"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Right Button */}
            <button
              onClick={() => scroll("right")}
              className="absolute right-[0px] sm:right-[-20px] top-1/2 z-30 p-2 bg-white shadow-xl rounded-full border border-slate-200 opacity-0 group-hover/section:opacity-100 md:block"
            >
              <ChevronRight size={24} />
            </button>

            {/* Scrollable Container */}
            <div
              ref={scrollContainerRef}
              className="flex justify-center flex-row w-full gap-4 sm:gap-6 overflow-x-auto pb-8 no-scrollbar scroll-smooth snap-x snap-mandatory sm:justify-start"
            >
              {savedLocations.map((item) => {
                const id = Number(item["properties"]["OBJECTID_1"]);
                return (
                  <div
                    key={`saved-wrapper-${id}`}
                    className="shrink-0 w-[320px] sm:w-[280px] snap-center sm:snap-start"
                  >
                    <LocationCard
                      id={id.toString()}
                      title={item["properties"]["PAGETITLE"]}
                      rating={4.8}
                      mrtLocation={item["properties"]["ADDRESS"] || "Singapore"}
                      category="Saved"
                      imageUrl={item["imageUrl"]}
                      isFavorite={true}
                      onFavoriteToggle={() => toggleSave(id)}
                    />
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 2. Empty State (Logged In but nothing saved) */}
        {isLoggedIn && savedLocations.length === 0 && (
          <section className="bg-slate-100/50 border-2 border-dashed border-slate-200 rounded-[32px] p-12">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-white rounded-2xl shadow-sm">
                <Heart size={32} className="text-slate-300" />
              </div>
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-slate-900">
                  No saved locations yet
                </h2>
                <p className="text-slate-500 text-sm max-w-xs">
                  Start exploring and click the heart icon on attractions to
                  build your personal travel list!
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Locked Message (If not Logged in) */}
        {!isLoggedIn && (
          <section className="bg-white rounded-[32px] p-10 border border-slate-200 shadow-sm overflow-hidden relative">
            {/* Background Decorative Circles */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-64 h-64 bg-[#1572D3]/5 rounded-full blur-3xl" />

            <div className="flex flex-col items-center text-center space-y-4 max-w-md mx-auto">
              {/* Icon with Ring Effect */}
              <div className="relative">
                <div className="absolute inset-0 bg-[#1572D3]/20 rounded-full animate-ping scale-75" />
                <div className="relative p-5 bg-[#1572D3]/10 rounded-full border border-[#1572D3]/20">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#1572D3"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-black italic tracking-tighter text-slate-900 ">
                  Saved Locations Locked
                </h2>
                <p className="text-slate-500 text-sm font-medium leading-relaxed px-4">
                  You need to sign in first to view and manage your favorite
                  Singapore spots!
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Browse More Section remains same... */}
        <section>
          <h2 className="text-2xl font-extrabold text-slate-900 mb-8 tracking-tight">
            Browse More
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-x-6 gap-y-10">
            {loading ? (
              <p className="text-slate-500 animate-pulse">Loading...</p>
            ) : (
              attractions.map((item) => {
                const itemId = item["properties"]["OBJECTID_1"];
                return (
                  <LocationCard
                    key={itemId}
                    id={itemId.toString()}
                    title={item["properties"]["PAGETITLE"]}
                    rating={4.8}
                    mrtLocation={item["properties"]["ADDRESS"] || "Singapore"}
                    category="Attraction"
                    imageUrl={item["imageUrl"]}
                    isFavorite={savedIds.includes(itemId)}
                    onFavoriteToggle={() => toggleSave(itemId)}
                  />
                );
              })
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
