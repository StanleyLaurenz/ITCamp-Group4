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
import { LoadingSpinner } from "@/components/LoadingSpinner";

const MapInner = dynamic(() => import("./MapInner"), { ssr: false });

// Colors used for the small indicator dots in the filter
const MRT_COLORS: Record<string, string> = {
  "NORTH-SOUTH LINE": "#D42E12",
  "EAST-WEST LINE": "#009543",
  "NORTH-EAST LINE": "#8F4199",
  "CIRCLE LINE": "#FFA400",
  "DOWNTOWN LINE": "#005BA4",
  "THOMSON-EAST COAST LINE": "#9D5B25",
};

export function MapFeature() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get("selectedId");

  const [landmarks, setLandmarks] = useState<Landmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showFullMRTMap, setShowFullMRTMap] = useState(false);

  // Layer States
  const [showLandmarks, setShowLandmarks] = useState(true);
  const [showTaxi, setShowTaxi] = useState(false);
  const [showRain, setShowRain] = useState(false);
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  const [showMRT, setShowMRT] = useState(false);
  const [activeLines, setActiveLines] = useState<string[]>([]);
  const [mrtData, setMrtData] = useState<{
    stations: any[];
    lines: any[];
  } | null>(null);

  useEffect(() => {
    if (showMRT && !mrtData) {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";
      fetch(`${baseUrl}/api/mrt`)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setMrtData(data);
          // Set active lines based on the colors dictionary keys
          setActiveLines(Object.keys(MRT_COLORS));
        })
        .catch((err) => console.error("MRT Fetch Error:", err));
    }
  }, [showMRT, mrtData]);

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

  const toggleMRTLine = (lineName: string) => {
    setActiveLines((prev) =>
      prev.includes(lineName)
        ? prev.filter((l) => l !== lineName)
        : [...prev, lineName]
    );
  };

  if (loading) {
    return (
      <div className="relative w-full h-[calc(100vh-64px)] bg-slate-50 flex flex-col items-center justify-center">
        <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/cartographer.png')]" />
        <div className="relative z-10 flex flex-col items-center gap-6">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex-1 w-full overflow-hidden">
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
          showMRT={showMRT}
          mrtData={mrtData}
          activeLines={activeLines}
        />
      )}

      {/* Main Filter Bar */}
      {!loading && !error && (
        <div className="absolute left-1/2 -translate-x-1/2 top-6 z-[500] flex flex-col items-center gap-3 w-fit max-w-[95vw]">
          <div className="flex items-center gap-1.5 rounded-[28px] border border-white/40 bg-white/80 p-1.5 shadow-2xl backdrop-blur-2xl">
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

            {/* MRT Master Toggle */}
            <button
              onClick={() => setShowMRT(!showMRT)}
              className={`flex items-center gap-2 rounded-[22px] px-4 py-2.5 transition-all active:scale-95 border ${
                showMRT
                  ? "bg-emerald-600 text-white border-emerald-700 shadow-md shadow-emerald-200"
                  : "bg-transparent text-slate-500 border-transparent hover:bg-slate-200/50"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  showMRT ? "bg-white animate-pulse" : "bg-emerald-500"
                }`}
              />
              <span className="text-[11px] font-black uppercase tracking-wider">
                MRT
              </span>
            </button>
          </div>

          {/* Sub-menu for MRT Lines */}
          {showMRT && (
            <div className="flex flex-wrap items-center justify-center gap-1.5 rounded-[20px] bg-white/90 p-1.5 shadow-xl backdrop-blur-md border border-slate-100 animate-in fade-in slide-in-from-top-2">
              {Object.entries(MRT_COLORS).map(([lineName, color]) => {
                const isActive = activeLines.includes(lineName);
                return (
                  <button
                    key={lineName}
                    onClick={() => toggleMRTLine(lineName)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full transition-all text-[9px] font-bold uppercase tracking-tight border ${
                      isActive
                        ? "bg-white border-slate-200 text-slate-900 shadow-sm"
                        : "bg-transparent border-transparent text-slate-400 opacity-50 hover:opacity-100"
                    }`}
                  >
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    {lineName.replace(" LINE", "")}
                  </button>
                );
              })}
            </div>
          )}

          {showMRT && (
            <button
              onClick={() => setShowFullMRTMap(true)}
              className="flex items-center gap-2 rounded-[22px] px-4 py-2.5 bg-slate-900 text-white shadow-lg transition-all active:scale-95 hover:bg-slate-800"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
              </svg>
              <span className="text-[11px] font-black uppercase tracking-wider">
                System Map
              </span>
            </button>
          )}

          {/* 2. Add the Modal Overlay at the very bottom of the return (outside the map div) */}
          {showFullMRTMap && (
            <div
              className="fixed top-3 z-[9999] flex items-center justify-center bg-slate-950/95 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-300 p-4"
              onClick={() => setShowFullMRTMap(false)}
            >
              {/* Box Container: 95% Width, 85% Height */}
              <div
                className="relative w-[95vw] h-[85vh] flex flex-col bg-white rounded-[32px] shadow-[0_0_80px_rgba(0,0,0,0.6)] overflow-hidden border border-white/20"
                onClick={(e) => e.stopPropagation()}
              >
                {/* 1. Integrated Header (Floats over the image) */}
                <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-8 py-6 bg-gradient-to-b from-white/90 via-white/40 to-transparent backdrop-blur-sm">
                  <div className="flex flex-col gap-1">
                    <div className="flex gap-1.5 mb-1">
                      {Object.values(MRT_COLORS).map((color, i) => (
                        <div
                          key={i}
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <h2 className="text-lg font-black uppercase tracking-[0.2em] text-slate-900">
                      Rail Network <span className="text-emerald-600">Map</span>
                    </h2>
                  </div>

                  <button
                    onClick={() => setShowFullMRTMap(false)}
                    className="flex items-center gap-3 px-5 py-2.5 bg-slate-900 text-white rounded-full hover:bg-[#1572D3] hover:scale-105 transition-all shadow-xl active:scale-95"
                  >
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      Close Viewer
                    </span>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* 2. Full-Bleed Image Container */}
                <div className="flex w-full h-full justify-center items-center relative group bg-slate-100 overflow-hidden">
                  <img
                    src="/sg-mrt.png"
                    alt="Singapore MRT System Map"
                    className="w-full h-full transition-transform duration-1000 group-hover:scale-110 cursor-move"
                    // Using object-cover makes it fit the box perfectly like a cover
                  />

                  {/* Subtle Overlay to make the bottom text readable if needed */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* 3. Floating Footer */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 bg-white/80 backdrop-blur-md px-6 py-2 rounded-full border border-white/40 shadow-sm">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.5em]">
                    Land Transport Authority &bull; Singapore
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
