"use client";

import { useEffect, useState } from "react";
import { Filter } from "./Filter";
import { Search } from "./Search";
import Link from "next/link";
import { LocationCard } from "./LocationCard";
import { getAttractions } from "../../lib/api";

export function LocationPage() {
  const [attractions, setAttractions] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      {/* 1. Responsive Search & Filter Bar */}
      <div className="px-4 pt-16">
        <div className="max-w-[700px] mx-auto flex flex-row items-center gap-3 sm:gap-5">
          {/* Search takes available space, Filter stays fixed width */}
          <div className="flex-grow">
            <Search />
          </div>
          <Filter />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 mt-12">
        {/* 2. Saved Section (Horizontal Scroll for better UX) */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Saved Locations
            </h2>
            <Link
              href="/saved"
              className="text-sm font-bold text-[#1572D3] hover:text-[#125ba8] transition-colors"
            >
              View all
            </Link>
          </div>

          {/* This container allows swiping on mobile but stays clean on desktop */}
          <div className="flex flex-row gap-6 overflow-x-auto pb-6 no-scrollbar snap-x snap-mandatory">
            {loading
              ? [...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="min-w-[300px] h-[420px] bg-slate-200 animate-pulse rounded-3xl"
                  />
                ))
              : attractions.slice(0, 5).map((item, index) => (
                  <div key={`saved-${index}`} className="snap-start shrink-0">
                    <LocationCard
                      id={index.toString()}
                      title={item["properties"]["PAGETITLE"]}
                      rating={4.8}
                      mrtLocation={item["properties"]["ADDRESS"] || "Singapore"}
                      category="Saved"
                      imageUrl={item["imageUrl"]}
                    />
                  </div>
                ))}
          </div>
        </section>

        {/* 3. Browse More Section (Responsive Grid) */}
        <section>
          <h2 className="text-2xl font-extrabold text-slate-900 mb-8 tracking-tight">
            Browse More
          </h2>

          {/* Grid Logic:
             1 col on mobile
             2 cols on small tablets (sm)
             3 cols on laptops (lg)
             4 cols on desktops (2xl)
          */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-x-6 gap-y-10 place-items-center">
            {loading
              ? [...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="w-full h-[420px] bg-slate-200 animate-pulse rounded-3xl"
                  />
                ))
              : attractions.map((item, index) => (
                  <LocationCard
                    key={item["properties"]["PAGETITLE"]}
                    id={index.toString()}
                    title={item["properties"]["PAGETITLE"]}
                    rating={4.8}
                    mrtLocation={item["properties"]["ADDRESS"] || "Singapore"}
                    category="Attraction"
                    imageUrl={item["imageUrl"]}
                  />
                ))}
          </div>
        </section>
      </div>
    </main>
  );
}
