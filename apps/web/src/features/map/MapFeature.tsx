"use client";

import WeatherWidget from "@/components/weatherWidget";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { MapPin, Heart } from "react-feather";
import { getAttractions, getMRTStations } from "@/lib/api";
import { rawAttractionToLandmark } from "@/lib/attractionData";
import { useSavedLocations } from "@/lib/useSavedLocations";
import { useAuth } from "@/context/AuthContext";
import type { Landmark, MrtStationMarker } from "./types";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import {
  MRT_FILTER_LINE_ORDER,
  MRT_LINE_COLORS,
} from "./mrtLineColors";

const MapInner = dynamic(() => import("./MapInner"), { ssr: false });

export function MapFeature() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get("selectedId");

  const [landmarks, setLandmarks] = useState<Landmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFullMRTMap, setShowFullMRTMap] = useState(false);

  const [showLandmarks, setShowLandmarks] = useState(true);
  const [showTaxi, setShowTaxi] = useState(false);
  const [showRain, setShowRain] = useState(false);
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [showMRT, setShowMRT] = useState(false);
  const [activeLines, setActiveLines] = useState<string[]>(() => [
    ...MRT_FILTER_LINE_ORDER,
  ]);
  const [mrtData, setMrtData] = useState<MrtStationMarker[] | null>(null);

  const { user } = useAuth();
  const isLoggedIn = !!user;
  const { savedIds, toggleSave } = useSavedLocations(
    user?.id ?? null,
    isLoggedIn
  );

  useEffect(() => {
    async function fetchAllMapData() {
      setLoading(true);
      try {
        const [attractionsData, mrtStations] = await Promise.all([
          getAttractions(),
          getMRTStations(),
        ]);

        const list = Array.isArray(attractionsData) ? attractionsData : [];
        const flattenedLandmarks = list.map((item) =>
          rawAttractionToLandmark(item)
        );

        setLandmarks(flattenedLandmarks);
        setMrtData(mrtStations);
      } catch {
        // Same as before: load failure leaves landmarks empty after loading ends
      } finally {
        setLoading(false);
      }
    }
    fetchAllMapData();
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

      <WeatherWidget />

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
                ? "bg-[#1572D3] text-white border-[#1572D3]"
                : "text-slate-500 border-transparent hover:bg-slate-200/50"
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                showMRT ? "bg-white animate-pulse" : "bg-[#1572D3]"
              }`}
            />
            <span className="text-[11px] font-black uppercase tracking-wider">
              MRT
            </span>
          </button>
        </div>

        {showMRT && (
          <div className="flex flex-wrap items-center justify-center gap-1.5 rounded-[20px] bg-white/90 p-1.5 shadow-xl backdrop-blur-md border border-slate-100 animate-in fade-in slide-in-from-top-2">
            {MRT_FILTER_LINE_ORDER.map((lineName) => (
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
                  style={{
                    backgroundColor: MRT_LINE_COLORS[lineName],
                  }}
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
