"use client";

import { MapPin, Heart } from "react-feather";

interface LocationCardProps {
  isSaved?: boolean;
}

export function LocationCard({ isSaved }: LocationCardProps) {
  return (
    <div
      className={`
      bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm
      transition-transform hover:scale-[1.02]
      ${isSaved ? "min-w-[280px] w-[280px]" : "w-full"}
    `}
    >
      {/* Placeholder for Image */}
      <div className="h-40 bg-slate-200 animate-pulse" />

      <div className="p-4 space-y-2">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-slate-800 leading-tight">
            Landmark Name
          </h3>
          <Heart
            size={18}
            className={isSaved ? "fill-red-500 text-red-500" : "text-slate-400"}
          />
        </div>

        <div className="flex items-center gap-1 text-slate-500 text-sm">
          <MapPin size={14} />
          <span>Singapore</span>
        </div>
      </div>
    </div>
  );
}
