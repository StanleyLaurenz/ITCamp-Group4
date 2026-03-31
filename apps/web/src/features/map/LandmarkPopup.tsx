"use client";

import { Heart, Star, MapPin, X, ExternalLink } from "react-feather";
import type { Landmark } from "./types";
import Link from "next/link";

interface LandmarkPopupProps {
  landmark: Landmark;
  isSaved: boolean;
  onToggleSave: () => void;
  onClose: () => void;
  isLoggedIn: boolean;
}

const categoryStyles: Record<string, string> = {
  "Arts & Museum": "bg-purple-500/10 text-purple-300 border-purple-500/20",
  "Culture & Heritage": "bg-amber-500/10 text-amber-300 border-amber-500/20",
  "Nature & Parks": "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  Architecture: "bg-blue-500/10 text-blue-300 border-blue-500/20",
  Lifestyle: "bg-pink-500/10 text-pink-300 border-pink-500/20",
  Landmark: "bg-slate-500/10 text-slate-300 border-slate-500/20",
};

export default function LandmarkPopup({
  landmark,
  isSaved,
  onToggleSave,
  onClose,
  isLoggedIn,
}: LandmarkPopupProps) {
  const backgroundUrl =
    landmark.imageUrl ||
    "https://images.unsplash.com/photo-1554904077-80928a30ef1d?q=80&w=600";

  return (
    <div className="w-[280px] sm:w-[300px] animate-in fade-in zoom-in duration-200">
      <div className="relative h-[420px] rounded-[32px] overflow-hidden shadow-2xl border border-white/20">
        <img
          src={backgroundUrl}
          className="absolute inset-0 w-full h-full object-cover z-0"
          alt={landmark.title}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10" />

        {/* Top Buttons */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-20 p-2 bg-black/40 backdrop-blur-md rounded-full border border-white/20 text-white hover:bg-black/60 transition-all"
        >
          <X size={14} />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            if (isLoggedIn) onToggleSave();
          }}
          className="absolute top-4 right-4 z-20 p-2.5 bg-black/40 backdrop-blur-md rounded-full border border-white/20 transition-all active:scale-90"
        >
          <Heart
            size={16}
            className={isSaved ? "fill-red-500 text-red-500" : "text-white"}
          />
        </button>

        {/* Content Section */}
        <div className="absolute bottom-0 left-0 right-0 p-6 z-20 text-white space-y-4">
          <div className="flex items-center gap-2">
            {/* Rating Badge */}
            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-lg px-3 py-1.5 rounded-xl border border-white/10">
              <Star size={12} className="text-yellow-400 fill-yellow-400" />
              <span className="font-bold text-[10px]">
                {landmark.rating?.toFixed(1)}
              </span>
            </div>

            {/* MRT Badge (Next to Rating) */}
            {landmark.nearestMRT && (
              <div className="flex items-center gap-1.5 bg-[#1572D3]/20 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#1572D3]/30">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#1572D3"
                  strokeWidth="3"
                >
                  <rect x="4" y="3" width="16" height="15" rx="2" />
                  <path d="M4 11h16M8 18l-2 3M16 18l2 3" />
                </svg>
                <span className="text-[10px] font-black uppercase text-white tracking-tight">
                  {landmark.nearestMRT.split(" (")[0]}{" "}
                  {/* Short name to save space */}
                </span>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <h3 className="text-xl font-black italic tracking-tighter leading-tight line-clamp-2 uppercase">
              {landmark.title}
            </h3>

            {/* Location and Categories grouped together */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-white/70 text-xs">
                <MapPin size={12} className="text-[#1572D3] shrink-0" />
                <span className="font-medium truncate">{landmark.address}</span>
              </div>

              {/* Category badges */}
              <div className="flex items-center flex-wrap gap-2">
                {landmark.categories.map((cat) => (
                  <span
                    key={cat}
                    className={`px-2.5 py-0.5 rounded-full text-[9px] font-black tracking-widest uppercase border backdrop-blur-md transition-colors ${
                      categoryStyles[cat] || categoryStyles["Landmark"]
                    }`}
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action Button */}
          <Link
            href={`/location?selectedId=${landmark.id}`}
            className="w-full !text-white  flex justify-center items-center gap-2 px-4 py-3 bg-[#1572D3] rounded-2xl text-[10px] font-black tracking-widest shadow-lg hover:bg-[#125ba8] transition-all active:scale-[0.98]"
          >
            <ExternalLink size={14} />
            View on Location
          </Link>
        </div>
      </div>
    </div>
  );
}
