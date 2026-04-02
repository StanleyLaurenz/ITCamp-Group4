"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getAttractions } from "@/lib/api";
import { useSavedLocations } from "@/lib/useSavedLocations";
import { calculateDistance } from "@/utils/distance";
import { getCategories } from "@/utils/categorize";
import { getStaticRating } from "@/utils/generateRating";
import { Filter } from "./Filter";
import { Search } from "./Search";
import { SavedSection } from "./SavedSection";
import { BrowseSection } from "./BrowseSection";
import { DetailsPopup } from "./DetailsPopup";

export function LocationPage() {
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const [attractions, setAttractions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(20);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLandmark, setSelectedLandmark] = useState<any>(null);
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(3);

  const isLoggedIn = !!user;

  const { savedIds, toggleSave } = useSavedLocations(
    user?.id ?? null,
    isLoggedIn
  );

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const attractionsData = await getAttractions();

        const unifiedData = (attractionsData || []).map((item: any) => {
          const id = Number(item.properties?.OBJECTID_1);
          return {
            ...item,
            id,
            rating: getStaticRating(id),
            categories: getCategories(item),
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
      const found = attractions.find(
        (item) => String(item.properties.OBJECTID_1) === idFromUrl
      );

      if (found) {
        setSelectedLandmark(found);
        setIsPopUpOpen(true);
      }
    }
  }, [searchParams, attractions]);

  const filteredAttractions = attractions.filter((item) => {
    const properties = item["properties"] || {};

    const titleMatch = (properties["PAGETITLE"] || "")
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const itemCats = getCategories(item);
    const categoryMatch =
      selectedCategories.length === 0 ||
      selectedCategories.some((cat) => itemCats.includes(cat));

    const itemRating = getStaticRating(Number(item.properties.OBJECTID_1));
    const ratingMatch = itemRating >= minRating;

    return titleMatch && categoryMatch && ratingMatch;
  });

  const savedLocations = attractions.filter((item) =>
    savedIds.includes(Number(item["properties"]["OBJECTID_1"]))
  );

  if (authLoading) return null;

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

        {selectedLandmark && (
          <DetailsPopup
            isOpen={isPopUpOpen}
            onClose={() => setIsPopUpOpen(false)}
            data={selectedLandmark}
            isFavorite={savedIds.includes(
              Number(selectedLandmark.properties.OBJECTID_1)
            )}
            onFavoriteToggle={() =>
              toggleSave(Number(selectedLandmark.properties.OBJECTID_1))
            }
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
