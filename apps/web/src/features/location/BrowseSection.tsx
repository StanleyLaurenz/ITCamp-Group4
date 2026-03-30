"use client";

import React from "react";
import { LocationCard } from "./LocationCard";
import { getCategories } from "../../utils/categorize";
import { getStaticRating } from "../../utils/generateRating";
import { Map } from "react-feather"; // Import Map icon
import Link from "next/link"; // Import Link

interface BrowseSectionProps {
  loading: boolean;
  searchQuery: string;
  filteredAttractions: any[];
  visibleCount: number;
  savedIds: number[];
  toggleSave: (id: number) => void;
  showMore: () => void;
  setSearchQuery: (query: string) => void;
}

export function BrowseSection({
  loading,
  searchQuery,
  filteredAttractions,
  visibleCount,
  savedIds,
  toggleSave,
  showMore,
  setSearchQuery,
}: BrowseSectionProps) {
  return (
    <section>
      {/* Updated Header with Flex Layout */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h2 className="text-2xl font-extrabold text-slate-900 italic tracking-tight">
          {searchQuery ? `Results for "${searchQuery}"` : "Browse More"}
        </h2>

        {!searchQuery && (
          <Link
            href="/map"
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#1572D3] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all active:scale-95 shadow-lg shadow-slate-200 group w-fit"
          >
            <Map
              size={14}
              className="group-hover:rotate-12 transition-transform"
            />
            View All on Map
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-x-6 gap-y-10">
        {loading
          ? // Render 4-8 Skeleton Cards while loading
            Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="w-full h-[420px] rounded-[32px] bg-slate-100 animate-pulse relative overflow-hidden"
              >
                <div className="absolute bottom-0 left-0 right-0 p-6 space-y-4">
                  <div className="h-6 w-3/4 bg-slate-200 rounded-lg" />
                  <div className="h-4 w-1/2 bg-slate-200 rounded-lg" />
                  <div className="h-10 w-full bg-slate-200 rounded-xl" />
                </div>
              </div>
            ))
          : filteredAttractions.slice(0, visibleCount).map((item) => {
              const id = Number(item["properties"]["OBJECTID_1"]);
              const dynamicCategory = getCategories(item);
              const rating = getStaticRating(id);

              return (
                <LocationCard
                  key={id}
                  id={id.toString()}
                  item={item}
                  title={item["properties"]["PAGETITLE"]}
                  rating={rating}
                  mrtLocation={item["properties"]["ADDRESS"] || "Singapore"}
                  categories={dynamicCategory}
                  imageUrl={item["imageUrl"]}
                  isFavorite={savedIds.includes(id)}
                  onFavoriteToggle={() => toggleSave(id)}
                />
              );
            })}
      </div>

      {filteredAttractions.length === 0 && !loading && (
        <div className="text-center py-24 bg-slate-100/50 rounded-[32px] border-2 border-dashed border-slate-200">
          <p className="text-slate-400 font-bold italic">
            No landmarks found matching "{searchQuery}"
          </p>
          <button
            onClick={() => setSearchQuery("")}
            className="mt-4 text-[#1572D3] text-xs font-black hover:underline"
          >
            Clear Search
          </button>
        </div>
      )}

      {!loading &&
        filteredAttractions.length > visibleCount &&
        searchQuery === "" && (
          <div className="mt-16 flex justify-center">
            <button
              onClick={showMore}
              className="group flex flex-col items-center gap-2 text-[#1572D3] font-black tracking-widest text-xs transition-all hover:text-[#125ba8]"
            >
              <span>See More</span>
              <div className="p-3 bg-[#1572D3]/10 rounded-full transition-transform group-hover:translate-y-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
                </svg>
              </div>
            </button>
          </div>
        )}
    </section>
  );
}
