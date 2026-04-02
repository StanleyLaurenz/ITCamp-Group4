"use client";

import React, { useState, useEffect } from "react";
import { Heart, Map, ArrowLeft } from "react-feather";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useSavedLocations } from "@/lib/useSavedLocations";
import { getAttractions } from "@/lib/api";
import { LocationCard } from "@/features/location/LocationCard";
import { getCategories } from "@/utils/categorize";
import Navbar from "@/components/Navbar";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { getStaticRating } from "@/utils/generateRating";

export default function SavedPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const isLoggedIn = !!user;

  const { savedOrder, toggleSave } = useSavedLocations(
    user?.id ?? null,
    isLoggedIn
  );

  const [attractions, setAttractions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      router.push("/login?returnTo=/saved");
    }
  }, [isLoggedIn, authLoading, router]);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const data = await getAttractions();

        const flattened = (data || []).map((item: any) => {
          const id = Number(item.properties?.OBJECTID_1);
          return {
            ...item,
            id,
            rating: getStaticRating(id),
            categories: getCategories(item),
          };
        });

        setAttractions(flattened);
      } catch (error) {
        console.error("Failed to fetch attractions:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const savedAttractions = attractions.filter((item) =>
    savedOrder.includes(Number(item.properties.OBJECTID_1))
  );

  const sortedSaved = [...savedAttractions].sort((a, b) => {
    return (
      savedOrder.indexOf(Number(b.properties.OBJECTID_1)) -
      savedOrder.indexOf(Number(a.properties.OBJECTID_1))
    );
  });

  if (authLoading || isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <LoadingSpinner />
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="pb-20">
        {/* Header Section */}
        <div className="bg-white border-b border-slate-100 pt-12 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href="/location"
              className="group inline-flex items-center gap-2 px-5 py-2.5 bg-blue-50 text-blue-600 rounded-full text-[12px] font-black uppercase tracking-[0.15em] hover:bg-blue-600 hover:text-white transition-all duration-300 mb-8 shadow-sm hover:shadow-blue-100 active:scale-95"
            >
              <ArrowLeft
                size={14}
                className="transition-transform group-hover:-translate-x-1"
              />
              Back to Explore
            </Link>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-50 text-red-500 rounded-xl">
                    <Heart size={24} className="fill-current" />
                  </div>
                  <h1 className="text-4xl font-black italic tracking-tighter text-slate-900 ">
                    My Collection
                  </h1>
                </div>
                <p className="text-slate-500 font-bold">
                  You have {savedOrder.length} locations saved in your travel
                  bucket list.
                </p>
              </div>

              <Link
                href="/map?showSavedOnly=true"
                className="flex items-center justify-center gap-3 px-8 py-4 bg-[#1572D3] text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-blue-600  transition-all active:scale-95 shadow-xl shadow-slate-200"
              >
                <Map size={18} />
                View All on Map
              </Link>
            </div>
          </div>
        </div>

        {/* Grid Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          {sortedSaved.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {sortedSaved.map((item) => (
                <LocationCard
                  key={item.properties.OBJECTID_1}
                  id={item.properties.OBJECTID_1}
                  title={item.properties.PAGETITLE}
                  mrtLocation={item.properties.ADDRESS || "Singapore"}
                  rating={item.rating}
                  categories={getCategories(item)}
                  imageUrl={item.imageUrl}
                  isFavorite={true}
                  onFavoriteToggle={() =>
                    toggleSave(Number(item.properties.OBJECTID_1))
                  }
                  item={item}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-slate-300">
                <Heart size={48} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black italic uppercase tracking-tighter text-slate-900">
                  Nothing saved yet
                </h3>
                <p className="text-slate-500 max-w-xs mx-auto">
                  Explore Singapore and tap the heart icon to save your favorite
                  spots here.
                </p>
              </div>
              <Link
                href="/location"
                className="px-8 py-3 bg-blue-600 text-white font-black uppercase tracking-widest text-xs rounded-xl hover:bg-blue-700 transition-all"
              >
                Start Exploring
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}