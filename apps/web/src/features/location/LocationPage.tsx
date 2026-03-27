"use client";

import { useEffect, useState } from "react";
import { Filter } from "./Filter";
import { Search } from "./Search";
import Link from "next/link";
import { LocationCard } from "./LocationCard";
import { getAttractions } from "../../lib/api";

export function LocationPage() {
  // 1. Fixed State Types: using <any[]> prevents the 'never' error
  const [attractions, setAttractions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [savedIds, setSavedIds] = useState<number[]>([]);

  // 3. Toggle function to add/remove from saved list
  const toggleSave = (id: number) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getAttractions();
        // data should be an array of features with the added 'imageUrl'
        setAttractions(data);
      } catch (error) {
        console.error("Failed to fetch data: ", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // 4. Filter the main list to show only "Saved" items at the top
  const savedLocations = attractions.filter((item) =>
    savedIds.includes(Number(item["properties"]["OBJECTID_1"]))
  );

  console.log("Current Saved IDs:", savedIds);
  console.log("Saved Locations Count:", savedLocations);

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      {/* 1. Responsive Search Bar Container */}
      <div className="px-4 pt-16">
        <div className="max-w-[700px] mx-auto flex flex-row items-center gap-3 sm:gap-5">
          <div className="flex-grow">
            <Search />
          </div>
          <Filter />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 mt-12">
        {/* 2. Saved Section - Only shows if items are hearted */}
        {/* 2. Saved Section */}
        {savedLocations.length > 0 && (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-extrabold mb-6 italic">
              Saved Locations
            </h2>

            {/* Ensure this container isn't hidden by CSS */}
            <div className="flex flex-row w-full gap-6 overflow-x-auto pb-8 no-scrollbar">
              {savedLocations.map((item) => {
                // ID of the location
                const id = Number(item["properties"]["OBJECTID_1"]);

                return (
                  <div
                    key={`saved-wrapper-${id}`} // Unique key for the wrapper
                    className="shrink-0 w-[320px]"
                  >
                    <LocationCard
                      id={id.toString()}
                      title={item["properties"]["PAGETITLE"]}
                      rating={4.8}
                      mrtLocation={item["properties"]["ADDRESS"] || "Singapore"}
                      category="Saved"
                      imageUrl={item["imageUrl"]}
                      isFavorite={true} // It's in the saved list, so always true
                      onFavoriteToggle={() => toggleSave(id)}
                    />
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 3. Browse More Section - Responsive Grid */}
        <section>
          <h2 className="text-2xl font-extrabold text-slate-900 mb-8 tracking-tight">
            Browse More
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-x-6 gap-y-10">
            {loading ? (
              <p className="text-slate-500 animate-pulse">
                Loading Singapore's best spots...
              </p>
            ) : (
              attractions.map((item) => {
                const itemId = item["properties"]["OBJECTID_1"];

                return (
                  <LocationCard
                    key={itemId}
                    id={itemId.toString()}
                    title={item["properties"]["PAGETITLE"]}
                    rating={4.8}
                    mrtLocation={item["properties"]["ADDRESS"] || "Singapore"}
                    category="Attraction"
                    imageUrl={item["imageUrl"]}
                    isFavorite={savedIds.includes(itemId)}
                    onFavoriteToggle={() => toggleSave(itemId)} // Pass the real ID here
                  />
                );
              })
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
