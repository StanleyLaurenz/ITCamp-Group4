"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Filter } from "./Filter";
import { Search } from "./Search";
import { getAttractions } from "../../lib/api";
import { useSavedLocations } from "../../lib/useSavedLocations";
import { SavedSection } from "./SavedSection";
import { BrowseSection } from "./BrowseSection";
import { DetailsPopUp } from "./DetailsPopUp";
import { getCategories } from "@/utils/categorize";
import { getStaticRating } from "@/utils/generateRating";
import { calculateDistance } from "@/utils/distance";

export function LocationPage() {
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const [attractions, setAttractions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(20);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLandmark, setSelectedLandmark] = useState<any>(null);
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);

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
      setLoading(true);
      try {
        const attractionsData = await getAttractions();

        // FLATTEN EVERYTHING HERE
        const unifiedData = (attractionsData || []).map((item: any) => {
          const id = Number(item.properties?.OBJECTID_1);
          return {
            ...item,
            id: id, // Top-level ID
            rating: getStaticRating(id), // Top-level Rating (Calculated once)
            categories: getCategories(item), // Top-level Categories
            // nearestMRT is already attached by backend
          };
        });

        setAttractions(unifiedData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    const idFromUrl = searchParams.get("selectedId");

    if (idFromUrl && attractions.length > 0) {
      // Find the specific landmark by its ID (OBJECTID_1)
      const found = attractions.find(
        (item) => String(item.properties.OBJECTID_1) === idFromUrl
      );

      if (found) {
        setSelectedLandmark(found);
        setIsPopUpOpen(true);
      }
    }
  }, [searchParams, attractions]);

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
    const itemRating = getStaticRating(Number(item.properties.OBJECTID_1));
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

        {selectedLandmark && (
          <DetailsPopUp
            isOpen={isPopUpOpen}
            onClose={() => setIsPopUpOpen(false)}
            data={selectedLandmark}
            isFavorite={savedIds.includes(
              Number(selectedLandmark.properties.OBJECTID_1)
            )}
            onFavoriteToggle={() =>
              toggleSave(Number(selectedLandmark.properties.OBJECTID_1))
            }
            // Ensure these props match your updated DetailsPopUp
            imageUrl={selectedLandmark.imageUrl}
            rating={getStaticRating(
              Number(selectedLandmark.properties.OBJECTID_1)
            )}
          />
        )}
      </div>
    </main>
  );
}
