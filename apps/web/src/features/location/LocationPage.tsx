"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Filter } from "./Filter";
import { Search } from "./Search";
import { getAttractions } from "../../lib/api";
import { useSavedLocations } from "../../lib/useSavedLocations";
import { SavedSection } from "./SavedSection";
import { BrowseSection } from "./BrowseSection";

export function LocationPage() {
  const [attractions, setAttractions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(20);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();
  const isLoggedIn = !!user;
  const { savedIds, toggleSave } = useSavedLocations(user?.id ?? null, isLoggedIn);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getAttractions();
        setAttractions(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredAttractions = attractions.filter((item) =>
    item["properties"]["PAGETITLE"]
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const savedLocations = attractions.filter((item) =>
    savedIds.includes(Number(item["properties"]["OBJECTID_1"]))
  );

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <div className="px-4 pt-16">
        <div className="max-w-[700px] mx-auto flex flex-row items-center gap-3 sm:gap-5">
          <div className="flex-grow">
            <Search onSearch={setSearchQuery} />
          </div>
          <Filter />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 mt-12">
        <SavedSection
          isLoggedIn={isLoggedIn}
          savedLocations={savedLocations}
          searchQuery={searchQuery}
          toggleSave={toggleSave}
        />

        <BrowseSection
          loading={loading}
          searchQuery={searchQuery}
          filteredAttractions={filteredAttractions}
          visibleCount={visibleCount}
          savedIds={savedIds}
          totalAttractionsCount={attractions.length}
          toggleSave={toggleSave}
          showMore={() => setVisibleCount((v) => v + 20)}
          setSearchQuery={setSearchQuery}
        />
      </div>
    </main>
  );
}
