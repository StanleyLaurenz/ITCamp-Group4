"use client";

import React, { useState } from "react";
import { MapPin, Heart, Star, Map, Info } from "react-feather";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { DetailsPopUp } from "./DetailsPopUp";
import Link from "next/link"; // Import Link

interface LocationCardProps {
  id: string;
  imageUrl?: string;
  title: string;
  rating: number;
  mrtLocation: string;
  nearestMRT?: string; // Add this line
  categories: string[];
  isFavorite: boolean;
  onFavoriteToggle: () => void;
  item: any;
}

export function LocationCard({
  id,
  imageUrl,
  title,
  rating,
  mrtLocation,
  categories,
  isFavorite,
  onFavoriteToggle,
  item,
}: LocationCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  const backgroundUrl =
    imageUrl ||
    "https://images.unsplash.com/photo-1554904077-80928a30ef1d?q=80&w=600";

  const categoryStyles: Record<string, string> = {
    "Arts & Museum": "bg-purple-500/10 text-purple-300 border-purple-500/20",
    "Culture & Heritage": "bg-amber-500/10 text-amber-300 border-amber-500/20",
    "Nature & Parks":
      "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
    Architecture: "bg-blue-500/10 text-blue-300 border-blue-500/20",
    Lifestyle: "bg-pink-500/10 text-pink-300 border-pink-500/20",
    Landmark: "bg-slate-500/10 text-slate-300 border-slate-500/20",
  };

  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth(); // Get user status

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      // If not logged in, redirect to login with a return path
      const returnUrl = encodeURIComponent(pathname);
      router.push(`/login?returnTo=${returnUrl}`);
      return;
    }

    // If logged in, proceed with the toggle
    onFavoriteToggle();
  };

  return (
    <div className="group relative w-full max-w-[320px] mx-auto h-[420px] rounded-[32px] overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl cursor-pointer">
      {/* 1. Background Image */}
      <img
        src={backgroundUrl}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-700 group-hover:scale-110"
      />

      {/* 2. Linear Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent z-10" />

      {/* 3. Favorite Icon */}
      <button
        onClick={handleFavoriteClick}
        className="absolute top-5 right-5 z-20 p-2.5 bg-black/20 backdrop-blur-md rounded-full border border-white/20 transition-all hover:bg-black/40 active:scale-90"
      >
        <Heart
          size={16}
          className={`transition-all duration-300 ${
            isFavorite ? "fill-red-500 text-red-500" : "text-white"
          }`}
        />
      </button>

      {/* 4. Content Section */}
      {/* 4. Content Section */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-20 text-white space-y-3">
        {/* 1. MRT Pre-header (Top of Title) */}
        {item.nearestMRT && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md border transition-all active:scale-95 group/mrt w-fit bg-[#1572D3]/20 border-[#1572D3]/30">
            {/* MRT Icon (SVG) */}
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="flex-shrink-0 text-[#1572D3]"
            >
              <rect x="4" y="3" width="16" height="15" rx="2" />
              <path d="M4 11h16M8 18l-2 3M16 18l2 3" />
            </svg>

            <span className="text-[10px] font-black uppercase text-white tracking-[0.1em] drop-shadow-md">
              {item.nearestMRT}
            </span>
          </div>
        )}

        {/* 2. Title & Address Row */}
        <div className="space-y-1">
          <h3 className="text-xl font-bold leading-tight line-clamp-2 tracking-tight text-white drop-shadow-lg">
            {title}
          </h3>
          <div className="flex items-center gap-1.5 text-white/60 text-[11px]">
            <MapPin size={10} className="flex-shrink-0 text-[#1572D3]" />
            <span className="font-medium truncate text-white/70">
              {mrtLocation}
            </span>
          </div>
        </div>

        {/* 3. Rating and Details Row */}
        <div className="flex gap-2 items-center pt-1">
          <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-white/10">
            <Star size={10} className="text-yellow-400 fill-yellow-400" />
            <span className="font-bold text-[10px] text-white">
              {rating.toFixed(1)}
            </span>
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowDetails(true);
            }}
            className="flex items-center gap-1.5 text-[10px] font-bold hover:bg-white/20 transition-colors bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-white"
          >
            <Info size={12} />
            Details
          </button>
        </div>

        {/* 4. Categories Grid */}
        <div className="flex items-center flex-wrap gap-1.5">
          {categories.map((cat) => (
            <span
              key={cat}
              className={`px-2 py-0.5 rounded-full text-[8px] font-black tracking-widest uppercase border backdrop-blur-md ${
                categoryStyles[cat] || categoryStyles["Landmark"]
              }`}
            >
              {cat}
            </span>
          ))}
        </div>

        {/* 5. View Map Button */}
        <Link
          href={`/map?selectedId=${id}`}
          onClick={(e) => e.stopPropagation()}
          className="w-full flex justify-center items-center gap-2 px-4 py-3 bg-[#1572D3] !text-white rounded-2xl text-[10px] font-black tracking-widest shadow-lg hover:bg-[#125ba8] transition-all active:scale-[0.98] mt-2 uppercase"
        >
          <Map size={14} className="text-white" />
          View Map
        </Link>
      </div>

      <DetailsPopUp
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        data={item}
        isFavorite={isFavorite}
        onFavoriteToggle={onFavoriteToggle}
        imageUrl={backgroundUrl}
        rating={rating}
      />
    </div>
  );
}
