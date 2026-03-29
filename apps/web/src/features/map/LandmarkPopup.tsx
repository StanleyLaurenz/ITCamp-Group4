"use client";

import { Heart, Star, Info, MapPin, X } from "react-feather";
import type { Landmark } from "./types";

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
    <div className="absolute bottom-6 right-4 z-[500] w-[300px] max-w-[calc(100vw-2rem)]">
      <div className="relative h-[420px] rounded-[32px] overflow-hidden shadow-2xl">
        {/* Background image */}
        <img
          src={backgroundUrl}
          alt={landmark.title}
          className="absolute inset-0 w-full h-full object-cover z-0"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent z-10" />

        {/* Close button — top left */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 z-20 p-2.5 bg-black/20 backdrop-blur-md rounded-full border border-white/20 transition-all hover:bg-black/40 active:scale-90"
          aria-label="Close"
        >
          <X size={16} className="text-white" />
        </button>

        {/* Heart / save button — top right */}
        <button
          onClick={() => {
            if (!isLoggedIn) return;
            onToggleSave();
          }}
          title={isLoggedIn ? undefined : "Log in to save"}
          className="absolute top-5 right-5 z-20 p-2.5 bg-black/20 backdrop-blur-md rounded-full border border-white/20 transition-all hover:bg-black/40 active:scale-90"
          aria-label={isSaved ? "Unsave" : "Save"}
        >
          <Heart
            size={16}
            className={`transition-all duration-300 ${
              isSaved ? "fill-red-500 text-red-500" : "text-white"
            }`}
          />
        </button>

        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 z-20 text-white space-y-4">
          {/* Rating + Details row */}
          <div className="flex gap-3 items-center">
            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-lg px-3 py-1.5 rounded-xl border border-white/10">
              <Star size={12} className="text-yellow-400 fill-yellow-400" />
              <span className="font-bold text-[10px]">
                {landmark.rating.toFixed(1)}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold bg-white/10 backdrop-blur-lg px-3 py-1.5 rounded-xl border border-white/10">
              <Info size={12} />
              DETAILS
            </div>
          </div>

          {/* Title + address */}
          <div className="space-y-1">
            <h3 className="text-xl font-bold leading-tight line-clamp-2 tracking-tight">
              {landmark.title}
            </h3>
            <div className="flex items-center gap-1.5 text-white/70 text-xs">
              <MapPin size={12} className="text-[#1572D3] shrink-0" />
              <span className="font-medium truncate">{landmark.address}</span>
            </div>
          </div>

          {/* Category badges */}
          <div className="flex items-center flex-wrap gap-2">
            {landmark.categories.map((cat) => (
              <span
                key={cat}
                className={`px-2.5 py-0.5 rounded-full text-[9px] font-black tracking-widest uppercase border backdrop-blur-md ${
                  categoryStyles[cat] || categoryStyles["Landmark"]
                }`}
              >
                {cat}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
