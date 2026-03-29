"use client";

import { useEffect, useState } from "react";
import { Filter } from "./Filter";
import { Search } from "./Search";
import { useAuth } from "@/context/AuthContext";
import { getAttractions } from "../../lib/api";
import { SavedSection } from "./SavedSection";
import { BrowseSection } from "./BrowseSection";
import { getCategories } from "@/utils/categorize";
import { getStaticRating } from "@/utils/generateRating";

export function LocationPage() {
  const { user, loading: authLoading } = useAuth();
  const [attractions, setAttractions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedIds, setSavedIds] = useState<number[]>([]);

  const [visibleCount, setVisibleCount] = useState(20);
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(3);

  const isLoggedIn = !!user;

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

  const toggleSave = (id: number) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const filteredAttractions = attractions.filter((item) => {
    const titleMatch = item["properties"]["PAGETITLE"]
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    // Check Category: If none selected, show all. If selected, must match at least one.
    const itemCats = getCategories(item); // Use the utility we made earlier
    const categoryMatch =
      selectedCategories.length === 0 ||
      selectedCategories.some((cat) => itemCats.includes(cat));

    // Check Rating: Use the utility we made earlier
    const ratingMatch =
      getStaticRating(Number(item["properties"]["OBJECTID_1"])) >= minRating;

    return titleMatch && categoryMatch && ratingMatch;
  });

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
          <Filter
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            minRating={minRating}
            setMinRating={setMinRating}
          />
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
          toggleSave={toggleSave}
          showMore={() => setVisibleCount((v) => v + 20)}
          setSearchQuery={setSearchQuery}
        />
      </div>
    </main>
  );
}
