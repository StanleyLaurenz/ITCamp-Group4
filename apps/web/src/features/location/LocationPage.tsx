"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Filter } from "./Filter";
import { Search } from "./Search";
import { getAttractions } from "../../lib/api";
import { useSavedLocations } from "../../lib/useSavedLocations";
import { SavedSection } from "./SavedSection";
import { BrowseSection } from "./BrowseSection";
import { getCategories } from "@/utils/categorize";
import { getStaticRating } from "@/utils/generateRating";

export function LocationPage() {
  const { user, loading: authLoading } = useAuth();
  const [attractions, setAttractions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(20);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter states
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(3);

  const isLoggedIn = !!user;

  // Using your custom hook for saved IDs and the toggle function
  const { savedIds, toggleSave } = useSavedLocations(
    user?.id ?? null,
    isLoggedIn
  );

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getAttractions();
        setAttractions(data || []);
      } catch (error) {
        console.error("Failed to fetch attractions:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // One consolidated filter function
  const filteredAttractions = attractions.filter((item) => {
    const properties = item["properties"] || {};

    // 1. Search Query Match
    const titleMatch = (properties["PAGETITLE"] || "")
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    // 2. Category Match
    const itemCats = getCategories(item);
    const categoryMatch =
      selectedCategories.length === 0 ||
      selectedCategories.some((cat) => itemCats.includes(cat));

    // 3. Rating Match
    const itemRating = getStaticRating(Number(properties["OBJECTID_1"]));
    const ratingMatch = itemRating >= minRating;

    return titleMatch && categoryMatch && ratingMatch;
  });

  // Filter the full attractions list to find those currently saved
  const savedLocations = attractions.filter((item) =>
    savedIds.includes(Number(item["properties"]["OBJECTID_1"]))
  );

  if (authLoading) return null; // Or a loading spinner

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      {/* Header Search & Filter Bar */}
      <div className="px-4 pt-16">
        <div className="max-w-[700px] mx-auto flex flex-row items-center gap-3 sm:gap-5">
          <div className="flex-grow">
            <Search onSearch={setSearchQuery} />
          </div>
          <Filter
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            minRating={minRating}
            setMinRating={setMinRating}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 mt-12">
        {/* Saved Items Section */}
        <SavedSection
          isLoggedIn={isLoggedIn}
          savedLocations={savedLocations}
          searchQuery={searchQuery}
          toggleSave={toggleSave}
        />

        {/* Main Browse Section */}
        <BrowseSection
          loading={loading}
          searchQuery={searchQuery}
          filteredAttractions={filteredAttractions}
          visibleCount={visibleCount}
          savedIds={savedIds}
          toggleSave={toggleSave}
          showMore={() => setVisibleCount((v) => v + 20)}
          setSearchQuery={setSearchQuery}
        />
      </div>
    </main>
  );
}

