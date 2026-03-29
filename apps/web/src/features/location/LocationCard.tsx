"use client";

import React, { useState } from "react";
import { MapPin, Heart, Star, Map, Info } from "react-feather";
import { DetailsPopUp } from "./DetailsPopUp";
import Link from "next/link"; // Import Link

interface LocationCardProps {
  id: string;
  imageUrl?: string;
  title: string;
  rating: number;
  mrtLocation: string;
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
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onFavoriteToggle();
        }}
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
      <div className="absolute bottom-0 left-0 right-0 p-6 z-20 text-white space-y-4">
        {/* Rating and Details Row */}
        <div className="flex gap-3 items-center">
          <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-lg px-3 py-1.5 rounded-xl border border-white/10">
            <Star size={12} className="text-yellow-400 fill-yellow-400" />
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
            className="flex items-center gap-1.5 text-[10px] font-bold hover:bg-white/20 transition-colors bg-white/10 backdrop-blur-lg px-3 py-1.5 rounded-xl border border-white/10 text-white"
          >
            <Info size={12} />
            Details
          </button>
        </div>

        {/* Title & Location */}
        <div className="space-y-1">
          <h3 className="text-xl font-bold leading-tight line-clamp-2 tracking-tight text-white">
            {title}
          </h3>
          <div className="flex items-center gap-1.5 text-white/70 text-xs">
            <MapPin size={12} className="text-[#1572D3]" />
            <span className="font-medium truncate text-white/80">
              {mrtLocation}
            </span>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="flex items-center flex-wrap gap-2">
          {categories.map((cat) => (
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

        {/* UPDATED: View Map Button with Link */}
        <Link
          href={`/map?selectedId=${id}`}
          onClick={(e) => e.stopPropagation()} // Prevent card details from opening
          className="w-full flex justify-center items-center gap-2 px-4 py-3 bg-[#1572D3] !text-white rounded-2xl text-xs font-black tracking-widest shadow-lg hover:bg-[#125ba8] transition-all active:scale-[0.98] mt-2"
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
