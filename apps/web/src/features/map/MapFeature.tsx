"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { MapPin, CloudRain, Heart } from "react-feather";
import { getAttractions } from "@/lib/api";
import { useSavedLocations } from "@/lib/useSavedLocations";
import { getCategories } from "@/utils/categorize";
import { getStaticRating } from "@/utils/generateRating";
import { useAuth } from "@/context/AuthContext";
import type { Landmark } from "./types";

const MapInner = dynamic(() => import("./MapInner"), { ssr: false });

export function MapFeature() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get("selectedId");

  const [landmarks, setLandmarks] = useState<Landmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Layer States
  const [showLandmarks, setShowLandmarks] = useState(true);
  const [showTaxi, setShowTaxi] = useState(false);
  const [showRain, setShowRain] = useState(false);
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  const { user } = useAuth();
  const isLoggedIn = !!user;
  const { savedIds, toggleSave } = useSavedLocations(
    user?.id ?? null,
    isLoggedIn
  );

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getAttractions();
        const normalized: Landmark[] = (data as any[])
          .filter((item) => item.geometry?.coordinates?.length >= 2)
          .map((item) => {
            const id = Number(item.properties.OBJECTID_1);
            return {
              id,
              title: item.properties.PAGETITLE,
              address: item.properties.ADDRESS || "Singapore",
              overview: item.properties.OVERVIEW || "",
              imageUrl: item.imageUrl ?? null,
              lat: item.geometry.coordinates[1],
              lng: item.geometry.coordinates[0],
              categories: getCategories(item),
              rating: getStaticRating(id),
            };
          });
        setLandmarks(normalized);
      } catch (err) {
        setError("Failed to load map data.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="relative flex-1 w-full overflow-hidden">
      {/* Loading/Error states ... */}

      {!loading && !error && landmarks.length > 0 && (
        <MapInner
          landmarks={landmarks}
          initialSelectedId={initialId ? Number(initialId) : null}
          savedIds={savedIds}
          onToggleSave={toggleSave}
          isLoggedIn={isLoggedIn}
          showLandmarks={showLandmarks}
          showTaxi={showTaxi}
          showRain={showRain}
          showSavedOnly={showSavedOnly}
        />
      )}

      {/* Wide Single-Line Filter Control */}
      {!loading && !error && (
        <div className="absolute left-1/2 -translate-x-1/2 top-6 z-[500] w-fit max-w-[95vw]">
          <div className="flex items-center gap-1.5 rounded-[28px] border border-white/40 bg-white/80 p-1.5 shadow-2xl backdrop-blur-2xl">
            {/* Landmark Toggle */}
            <button
              onClick={() => setShowLandmarks(!showLandmarks)}
              className={`flex items-center gap-2 rounded-[22px] px-4 py-2.5 transition-all active:scale-95 ${
                showLandmarks
                  ? "bg-[#1572D3] text-white shadow-md shadow-[#1572D3]/30"
                  : "bg-transparent text-slate-500 hover:bg-slate-200/50"
              }`}
            >
              <MapPin size={18} />
              <span className="text-[11px] font-black uppercase tracking-wider">
                Landmarks
              </span>
            </button>

            {/* Taxi Toggle */}
            <button
              onClick={() => setShowTaxi(!showTaxi)}
              className={`flex items-center gap-2 rounded-[22px] px-4 py-2.5 transition-all active:scale-95 ${
                showTaxi
                  ? "bg-[#1572D3] text-white shadow-md shadow-[#1572D3]/30"
                  : "bg-transparent text-slate-500 hover:bg-slate-200/50"
              }`}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M5 11l1.4-4.2A2 2 0 0 1 8.3 5.5h7.4a2 2 0 0 1 1.9 1.3L19 11M4 11h16a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-1v1.5a.5.5 0 0 1-.5.5H17a.5.5 0 0 1-.5-.5V17h-9v1.5a.5.5 0 0 1-.5.5H5.5a.5.5 0 0 1-.5-.5V17H4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1Z" />
              </svg>
              <span className="text-[11px] font-black uppercase tracking-wider">
                Taxi
              </span>
            </button>

            {/* Rain Toggle */}
            <button
              onClick={() => setShowRain(!showRain)}
              className={`flex items-center gap-2 rounded-[22px] px-4 py-2.5 transition-all active:scale-95 ${
                showRain
                  ? "bg-[#1572D3] text-white shadow-md shadow-[#1572D3]/30"
                  : "bg-transparent text-slate-500 hover:bg-slate-200/50"
              }`}
            >
              <CloudRain size={18} />
              <span className="text-[11px] font-black uppercase tracking-wider">
                Rain
              </span>
            </button>

            {/* Saved Toggle */}
            <button
              onClick={() => setShowSavedOnly(!showSavedOnly)}
              disabled={!isLoggedIn}
              className={`flex items-center gap-2 rounded-[22px] px-4 py-2.5 transition-all active:scale-95 ${
                showSavedOnly
                  ? "bg-[#1572D3] text-white shadow-md shadow-[#1572D3]/30"
                  : "bg-transparent text-slate-500 hover:bg-slate-200/50"
              } ${!isLoggedIn && "opacity-30 cursor-not-allowed"}`}
            >
              <Heart size={18} className={showSavedOnly ? "fill-white" : ""} />
              <span className="text-[11px] font-black uppercase tracking-wider">
                Saved
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
