"use client";

import React, { useState } from "react";
import { MapPin, Heart, Star, Map, Info } from "react-feather";

interface LocationCardProps {
  id: string;
  imageUrl?: string;
  title: string;
  rating: number;
  mrtLocation: string;
  category: string;
}

export function LocationCard({
  id,
  imageUrl,
  title,
  rating,
  mrtLocation,
  category,
}: LocationCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  const backgroundUrl =
    imageUrl ||
    "https://images.unsplash.com/photo-1554904077-80928a30ef1d?q=80&w=600";

  return (
    /* Changed w-[300px] to w-full with a max-width limit */
    <div className="group relative w-full max-w-[320px] mx-auto h-[420px] rounded-3xl overflow-hidden shadow-lg transition-transform cursor-pointer">
      {/* 1. Background Image */}
      <img
        src={backgroundUrl}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-500 group-hover:scale-110"
      />

      {/* 2. Linear Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />

      {/* 3. Favorite Icon */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // Prevents triggering card click
          setIsFavorite(!isFavorite);
        }}
        className="absolute top-4 right-4 z-20 p-2 bg-black/30 backdrop-blur-sm rounded-full transition-colors hover:bg-black/50 active:scale-95"
      >
        <Heart
          size={16}
          className={`transition-colors ${
            isFavorite ? "fill-red-500 text-red-500" : "text-white"
          }`}
        />
      </button>

      {/* 4. Content Section */}
      <div className="absolute bottom-0 left-0 right-0 p-5 z-20 text-white space-y-3">
        {/* Rating and Details */}
        <div className="flex gap-3 items-center">
          <div className="flex items-center gap-1 bg-[#B8B8B8]/30 backdrop-blur-md p-[6px] px-3 rounded-xl border border-white/10">
            <Star size={12} className="text-yellow-400 fill-yellow-400" />
            <span className="font-bold text-xs">{rating.toFixed(1)}</span>
          </div>

          <button className="flex items-center gap-1.5 text-xs font-medium hover:scale-105 transition-all duration-150 bg-[#B8B8B8]/30 backdrop-blur-md p-[6px] px-3 rounded-xl border border-white/10">
            <Info size={14} />
            Details
          </button>
        </div>

        {/* Location Title - line-clamp ensures it doesn't break layout */}
        <h3 className="text-xl font-bold tracking-tight leading-tight line-clamp-2">
          {title}
        </h3>

        {/* MRT Location */}
        <div className="flex items-center gap-1.5 text-white/80 text-xs">
          <MapPin size={14} className="text-[#1572D3]" />
          <span className="font-medium truncate">{mrtLocation}</span>
        </div>

        {/* Categories */}
        <div className="flex items-center flex-wrap gap-2 pt-1">
          <span className="px-2.5 py-[5px] bg-white/10 backdrop-blur-sm rounded-full text-[10px] font-bold tracking-wider uppercase border border-white/5">
            {category}
          </span>
          <span className="px-2.5 py-[5px] bg-white/10 backdrop-blur-sm rounded-full text-[10px] font-bold tracking-wider uppercase border border-white/5">
            Tourist
          </span>
        </div>

        {/* View Map Button (Full width) */}
        <button className="w-full flex justify-center items-center gap-1.5 px-4 py-2.5 bg-[#1572D3] rounded-full text-xs font-bold shadow-md hover:bg-[#125ba8] transition-all active:scale-95 mt-1">
          <Map size={14} />
          View Map
        </button>
      </div>
    </div>
  );
}
