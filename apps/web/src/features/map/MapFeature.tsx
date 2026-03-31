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
import { calculateDistance } from "@/utils/distance";

const MapInner = dynamic(() => import("./MapInner"), { ssr: false });

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
  const [activeLines, setActiveLines] = useState<string[]>(
    Object.keys(MRT_COLORS)
  );
  const [mrtData, setMrtData] = useState<{
    stations: any[];
    lines: any[];
  } | null>(null);

  const { user } = useAuth();
  const isLoggedIn = !!user;
  const { savedIds, toggleSave } = useSavedLocations(
    user?.id ?? null,
    isLoggedIn
  );

  // Inside MapFeature.tsx -> fetchAllData function
  useEffect(() => {
    async function fetchAllData() {
      setLoading(true);
      try {
        const baseUrl =
          process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

        const [attractionsData, mrtResponse] = await Promise.all([
          getAttractions(),
          fetch(`${baseUrl}/api/mrt`)
            .then((res) => (res.ok ? res.json() : null))
            .catch(() => null),
        ]);

        const stations = Array.isArray(mrtResponse)
          ? mrtResponse
          : mrtResponse?.stations || [];

        setMrtData(mrtResponse);

        const enriched: Landmark[] = (attractionsData as any[])
          .filter((item) => item.geometry?.coordinates?.length >= 2)
          .map((item) => {
            const id = Number(item.properties.OBJECTID_1);
            const lat = item.geometry.coordinates[1];
            const lng = item.geometry.coordinates[0];

            let nearest = { name: "Unknown", distance: Infinity };

            if (stations.length > 0) {
              stations.forEach((st: any) => {
                // Ensure we are accessing the position correctly [lat, lng]
                const stPos = st.position || [st.lat, st.lng];
                if (stPos) {
                  const d = calculateDistance(lat, lng, stPos[0], stPos[1]);
                  if (d < nearest.distance) {
                    nearest = { name: st.name || st.station_name, distance: d };
                  }
                }
              });
            }

            return {
              id,
              title: item.properties.PAGETITLE,
              address: item.properties.ADDRESS || "Singapore",
              overview: item.properties.OVERVIEW || "",
              imageUrl: item.imageUrl ?? null,
              lat,
              lng,
              categories: getCategories(item),
              rating: getStaticRating(id),
              // ATTACH THE PROPERTY
              nearestMRT:
                nearest.name !== "Unknown"
                  ? `${nearest.name} (${nearest.distance.toFixed(2)} km)`
                  : "",
            };
          });

        setLandmarks(enriched);
      } catch (err) {
        console.error("Critical Load Error:", err);
        setError("Failed to load map data.");
      } finally {
        setLoading(false);
      }
    }

    fetchAllData();
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
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="relative flex-1 w-full overflow-hidden">
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

      {/* Main Filter Bar */}
      <div className="absolute left-1/2 -translate-x-1/2 top-6 z-[500] flex flex-col items-center gap-3 w-fit max-w-[95vw]">
        <div className="flex items-center gap-1.5 rounded-[28px] border border-white/40 bg-white/80 p-1.5 shadow-2xl backdrop-blur-2xl">
          <button
            onClick={() => setShowLandmarks(!showLandmarks)}
            className={`flex items-center gap-2 rounded-[22px] px-4 py-2.5 transition-all active:scale-95 ${
              showLandmarks
                ? "bg-[#1572D3] text-white"
                : "text-slate-500 hover:bg-slate-200/50"
            }`}
          >
            <MapPin size={18} />
            <span className="text-[11px] font-black uppercase">Landmarks</span>
          </button>

          <button
            onClick={() => setShowTaxi(!showTaxi)}
            className={`flex items-center gap-2 rounded-[22px] px-4 py-2.5 transition-all active:scale-95 ${
              showTaxi
                ? "bg-[#1572D3] text-white"
                : "text-slate-500 hover:bg-slate-200/50"
            }`}
          >
            <span className="text-[11px] font-black uppercase tracking-wider">
              Taxi
            </span>
          </button>

          <button
            onClick={() => setShowRain(!showRain)}
            className={`flex items-center gap-2 rounded-[22px] px-4 py-2.5 transition-all active:scale-95 ${
              showRain
                ? "bg-[#1572D3] text-white"
                : "text-slate-500 hover:bg-slate-200/50"
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
                ? "bg-[#1572D3] text-white"
                : "text-slate-500 hover:bg-slate-200/50"
            } ${!isLoggedIn && "opacity-30 cursor-not-allowed"}`}
          >
            <Heart size={18} className={showSavedOnly ? "fill-white" : ""} />
            <span className="text-[11px] font-black uppercase tracking-wider">
              Saved
            </span>
          </button>

          <button
            onClick={() => setShowMRT(!showMRT)}
            className={`flex items-center gap-2 rounded-[22px] px-4 py-2.5 transition-all active:scale-95 border ${
              showMRT
                ? "bg-emerald-600 text-white border-emerald-700"
                : "text-slate-500 border-transparent hover:bg-slate-200/50"
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
            {Object.entries(MRT_COLORS).map(([lineName, color]) => (
              <button
                key={lineName}
                onClick={() => toggleMRTLine(lineName)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full transition-all text-[9px] font-bold uppercase border ${
                  activeLines.includes(lineName)
                    ? "bg-white border-slate-200 text-slate-900 shadow-sm"
                    : "text-slate-400 opacity-50"
                }`}
              >
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: color }}
                />
                {lineName.replace(" LINE", "")}
              </button>
            ))}
          </div>
        )}

        {showMRT && (
          <button
            onClick={() => setShowFullMRTMap(true)}
            className="flex items-center gap-2 rounded-[22px] px-4 py-2.5 bg-slate-900 text-white shadow-lg transition-all hover:bg-slate-800"
          >
            <span className="text-[11px] font-black uppercase tracking-wider">
              System Map
            </span>
          </button>
        )}
      </div>

      {/* Full MRT Map Modal */}
      {showFullMRTMap && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/95 backdrop-blur-xl p-4"
          onClick={() => setShowFullMRTMap(false)}
        >
          <div
            className="relative w-[95vw] h-[85vh] bg-white rounded-[32px] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-8 py-6 bg-white/90 backdrop-blur-sm">
              <h2 className="text-lg font-black uppercase tracking-widest">
                Rail Network <span className="text-emerald-600">Map</span>
              </h2>
              <button
                onClick={() => setShowFullMRTMap(false)}
                className="px-5 py-2.5 bg-slate-900 text-white rounded-full font-black text-[10px] uppercase"
              >
                Close
              </button>
            </div>
            <div className="w-full h-full p-8 flex items-center justify-center bg-slate-50">
              <img
                src="/sg-mrt.png"
                alt="MRT Map"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
