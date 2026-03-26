"use client";

import { useEffect, useState } from "react";
import { Filter } from "./Filter";
import { Search } from "./Search";
import Link from "next/link";
import { LocationCard } from "./LocationCard";
import { getAttractions } from "../../lib/api";

export function LocationPage() {
  useEffect(() => {
    async function fetchData() {
      const data = await getAttractions();
      console.log(data);
    }
    fetchData();
  }, []);

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
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <LocationCard
              id="1"
              title="Gardens by the Bay"
              rating={4.8}
              mrtLocation="Bayfront MRT"
              category="Attraction"
              imageUrl="https://www.arup.com/globalassets/images/projects/m/marina-bay-sands-integrated-resort/marina-bay-sands-integrated-resort-header.webp?width=1840&height=1035&quality=80"
            />
            {/* Add more cards... */}
          </div>
        </section>

        {/* 3. Browse More Section (Grid) */}
        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-6 px-2">
            Browse More
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <LocationCard
              id="2"
              title="Gardens by the Bay"
              rating={4.8}
              mrtLocation="Bayfront MRT"
              category="Attraction"
              imageUrl="https://images.unsplash.com/photo-1554904077-80928a30ef1d?q=80&w=600"
            />
            {/* Add more cards... */}
          </div>
        </section>
      </div>
    </main>
  );
}
