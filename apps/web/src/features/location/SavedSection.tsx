"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Heart } from "react-feather";
import { LocationCard } from "./LocationCard";
import { getCategories } from "../../utils/categorize";

interface SavedSectionProps {
  isLoggedIn: boolean;
  savedLocations: any[];
  searchQuery: string;
  toggleSave: (id: number) => void;
}

export function SavedSection({
  isLoggedIn,
  savedLocations,
  searchQuery,
  toggleSave,
}: SavedSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 340;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // 1. Locked Message
  if (!isLoggedIn && searchQuery === "") {
    return (
      <section className="bg-slate-100/50 rounded-[32px] p-10 border border-slate-200 shadow-sm overflow-hidden relative">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-64 h-64 bg-[#1572D3]/5 rounded-full blur-3xl" />
        <div className="flex flex-col items-center text-center space-y-4 max-w-md mx-auto">
          <div className="relative p-5 bg-[#1572D3]/10 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#1572D3"
              strokeWidth="2.5"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h2 className="text-2xl font-black italic tracking-tighter text-slate-900 ">
            Saved Locations Locked
          </h2>
          <p className="text-slate-500 text-sm px-4">
            You need to sign in first to view and manage your favorite Singapore
            spots!
          </p>
        </div>
      </section>
    );
  }

  // 2. Empty State
  if (isLoggedIn && savedLocations.length === 0 && searchQuery === "") {
    return (
      <section className="bg-slate-100/50 border-2 border-dashed border-slate-200 rounded-[32px] p-12">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="p-4 bg-white rounded-2xl shadow-sm">
            <Heart size={32} className="text-slate-300" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            No saved locations yet
          </h2>
          <p className="text-slate-500 text-sm max-w-xs">
            Start exploring and click the heart icon on attractions to build
            your personal travel list!
          </p>
        </div>
      </section>
    );
  }

  // 3. Saved Items Carousel
  if (savedLocations.length > 0 && isLoggedIn && searchQuery === "") {
    return (
      <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 relative group/section">
        <div className="flex justify-between items-center mb-6 px-2">
          <h2 className="text-2xl font-extrabold italic tracking-tighter text-slate-900">
            Saved Locations
          </h2>
          <Link
            href="/saved"
            className="flex items-center gap-2 text-sm font-bold text-[#1572D3] hover:text-[#125ba8] transition-colors bg-[#1572D3]/5 px-4 py-2 rounded-full"
          >
            View all ({savedLocations.length}) <span>→</span>
          </Link>
        </div>
        <button
          onClick={() => scroll("left")}
          className="absolute left-[0px] sm:left-[-20px] top-1/2 z-50 p-2 bg-white shadow-xl rounded-full border border-slate-200 opacity-0 group-hover/section:opacity-100 transition-opacity md:block"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={() => scroll("right")}
          className="absolute right-[0px] sm:right-[-20px] top-1/2 z-30 p-2 bg-white shadow-xl rounded-full border border-slate-200 opacity-0 group-hover/section:opacity-100 md:block"
        >
          <ChevronRight size={24} />
        </button>
        <div
          ref={scrollContainerRef}
          className="flex justify-center flex-row w-full gap-4 sm:gap-6 overflow-x-auto pb-8 no-scrollbar scroll-smooth snap-x snap-mandatory sm:justify-start"
        >
          {savedLocations.map((item) => {
            const id = Number(item["properties"]["OBJECTID_1"]);
            const dynamicCategory = getCategories(item);
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
                  categories={dynamicCategory}
                  imageUrl={item["imageUrl"]}
                  isFavorite={true}
                  onFavoriteToggle={() => toggleSave(id)}
                />
              </div>
            );
          })}
        </div>
      </section>
    );
  }

  return null;
}
