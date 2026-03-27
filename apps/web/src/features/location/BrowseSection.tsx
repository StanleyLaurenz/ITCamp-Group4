"use client";

import React from "react";
import { LocationCard } from "./LocationCard";
import { getCategories } from "../../utils/categorize";
import { getStaticRating } from "../../utils/generateRating";

interface BrowseSectionProps {
  loading: boolean;
  searchQuery: string;
  filteredAttractions: any[];
  visibleCount: number;
  savedIds: number[];
  totalAttractionsCount: number;
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
  totalAttractionsCount,
  toggleSave,
  showMore,
  setSearchQuery,
}: BrowseSectionProps) {
  return (
    <section>
      <h2 className="text-2xl font-extrabold text-slate-900 mb-8 italic tracking-tight">
        {searchQuery ? `Results for "${searchQuery}"` : "Browse More"}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-x-6 gap-y-10">
        {loading ? (
          <p className="text-slate-500 animate-pulse font-bold">
            Loading landmarks...
          </p>
        ) : (
          filteredAttractions.slice(0, visibleCount).map((item) => {
            const id = Number(item["properties"]["OBJECTID_1"]);

            const dynamicCategory = getCategories(item);
            const rating = getStaticRating(id);

            return (
              <LocationCard
                key={id}
                id={id.toString()}
                title={item["properties"]["PAGETITLE"]}
                rating={rating}
                mrtLocation={item["properties"]["ADDRESS"] || "Singapore"}
                categories={dynamicCategory}
                imageUrl={item["imageUrl"]}
                isFavorite={savedIds.includes(id)}
                onFavoriteToggle={() => toggleSave(id)}
              />
            );
          })
        )}
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
        totalAttractionsCount > visibleCount &&
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
