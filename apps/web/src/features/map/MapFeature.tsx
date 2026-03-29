"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { MapPin } from "react-feather";
import { getAttractions } from "@/lib/api";
import { useSavedLocations } from "@/lib/useSavedLocations";
import { getCategories } from "@/utils/categorize";
import { getStaticRating } from "@/utils/generateRating";
import { useAuth } from "@/context/AuthContext";
import type { Landmark } from "./types";

// Dynamically import MapInner with SSR disabled — Leaflet requires window
const MapInner = dynamic(() => import("./MapInner"), { ssr: false });

export function MapFeature() {
  const [landmarks, setLandmarks] = useState<Landmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLandmarks, setShowLandmarks] = useState(true);
  const [showTaxi, setShowTaxi] = useState(false);

  const { user } = useAuth();
  const isLoggedIn = !!user;
  const { savedIds, toggleSave } = useSavedLocations(user?.id ?? null, isLoggedIn);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getAttractions();

        const normalized: Landmark[] = (data as unknown[])
          .filter((item: unknown) => {
            const feature = item as {
              geometry?: { coordinates?: number[] };
            };
            const coords = feature.geometry?.coordinates;
            return (
              Array.isArray(coords) &&
              coords.length >= 2 &&
              isFinite(coords[0]) &&
              isFinite(coords[1])
            );
          })
          .map((item: unknown) => {
            const feature = item as {
              geometry: { coordinates: number[] };
              properties: {
                OBJECTID_1: number;
                PAGETITLE: string;
                ADDRESS?: string;
                OVERVIEW?: string;
              };
              imageUrl?: string | null;
            };
            const [lng, lat] = feature.geometry.coordinates;
            const id = Number(feature.properties.OBJECTID_1);
            return {
              id,
              title: feature.properties.PAGETITLE,
              address: feature.properties.ADDRESS || "Singapore",
              overview: feature.properties.OVERVIEW || "",
              imageUrl: feature.imageUrl ?? null,
              lat,
              lng,
              categories: getCategories(item),
              rating: getStaticRating(id),
            };
          });

        setLandmarks(normalized);
      } catch (err) {
        setError("Failed to load map data. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div
      className="relative flex-1 w-full overflow-hidden"
      style={{ minHeight: 0 }}
    >
      {/* Loading state */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100 z-10">
          <p className="text-slate-500 font-bold animate-pulse">
            Loading map…
          </p>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100 z-10">
          <p className="text-red-500 font-bold">{error}</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && landmarks.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100 z-10">
          <p className="text-slate-500 font-bold">No landmarks found.</p>
        </div>
      )}

      {/* Map — rendered once data is ready */}
      {!loading && !error && landmarks.length > 0 && (
        <MapInner
          landmarks={landmarks}
          savedIds={savedIds}
          onToggleSave={toggleSave}
          isLoggedIn={isLoggedIn}
          showLandmarks={showLandmarks}
          showTaxi={showTaxi}
        />
      )}

      {/* Floating layer control */}
      {!loading && !error && (
        <div className="absolute right-4 top-4 z-[500] rounded-3xl border border-white/70 bg-white/95 p-3 shadow-xl backdrop-blur-md">
          <div className="flex items-start gap-3">
            <button
              type="button"
              onClick={() => setShowTaxi((value) => !value)}
              className={`flex min-w-[88px] flex-col items-center gap-2 rounded-2xl px-3 py-3 transition-all ${
                showTaxi
                  ? "bg-slate-900 text-white shadow-md"
                  : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              }`}
              aria-pressed={showTaxi}
              aria-label="Toggle taxi stands"
            >
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 11l1.4-4.2A2 2 0 0 1 8.3 5.5h7.4a2 2 0 0 1 1.9 1.3L19 11" />
                <path d="M4 11h16a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-1v1.5a.5.5 0 0 1-.5.5H17a.5.5 0 0 1-.5-.5V17h-9v1.5a.5.5 0 0 1-.5.5H5.5a.5.5 0 0 1-.5-.5V17H4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1Z" />
                <circle cx="7.5" cy="14.5" r="1" fill="currentColor" stroke="none" />
                <circle cx="16.5" cy="14.5" r="1" fill="currentColor" stroke="none" />
              </svg>
              <span className="text-xs font-bold">Taxi</span>
            </button>

            <button
              type="button"
              onClick={() => setShowLandmarks((value) => !value)}
              className={`flex min-w-[88px] flex-col items-center gap-2 rounded-2xl px-3 py-3 transition-all ${
                showLandmarks
                  ? "bg-[#1572D3] text-white shadow-md"
                  : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              }`}
              aria-pressed={showLandmarks}
              aria-label="Toggle landmarks"
            >
              <MapPin size={26} />
              <span className="text-xs font-bold">Landmarks</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
