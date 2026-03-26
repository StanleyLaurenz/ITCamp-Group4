"use client";

import { useEffect, useState } from "react";
import { Filter } from "./Filter";
import { Search } from "./Search";
import Link from "next/link";
import { LocationCard } from "./LocationCard";

export function LocationPage() {
  return (
    // Navbar
    <main>
      {/* Search Bar & Filter Button */}
      <div className="w-1/2 max-w-[600px] m-auto flex justify-center items-center gap-5 mt-16 bg-red ">
        <Filter />
        <Search />
      </div>

      <div className="max-w-7xl mx-auto space-y-12 mt-10">
        {/* 2. Saved Section (Horizontal Row) */}
        <section>
          <div className="flex justify-between items-end mb-4 px-2">
            <h2 className="text-xl font-bold text-slate-800">
              Saved Locations
            </h2>
            <Link
              href="/saved"
              className="text-sm font-semibold text-[#1572D3] hover:underline"
            >
              Click to view more
            </Link>
          </div>
          {/* Flex row that allows for horizontal scrolling if needed */}
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
            <LocationCard isSaved />
            <LocationCard isSaved />
            <LocationCard isSaved />
          </div>
        </section>

        {/* 3. Browse More Section (Grid) */}
        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-6 px-2">
            Browse More
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <LocationCard />
            <LocationCard />
            <LocationCard />
            <LocationCard />
            <LocationCard />
            <LocationCard />
          </div>
        </section>
      </div>
    </main>
  );
}
