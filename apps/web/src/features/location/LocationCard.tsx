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
  isFavorite: boolean;
  onFavoriteToggle: () => void;
}

export function LocationCard({
  id,
  imageUrl,
  title,
  rating,
  mrtLocation,
  category,
  isFavorite,
  onFavoriteToggle,
}: LocationCardProps) {
  const backgroundUrl =
    imageUrl ||
    "https://images.unsplash.com/photo-1554904077-80928a30ef1d?q=80&w=600";

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

      {/* 3. Favorite Icon (UPDATED Logic) */}
      <button
        onClick={(e) => {
          e.preventDefault(); // Stop any parent links
          e.stopPropagation(); // Stop card click events
          onFavoriteToggle(); // This is the key fix!
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
            <span className="font-bold text-[10px]">{rating.toFixed(1)}</span>
          </div>

          <button className="flex items-center gap-1.5 text-[10px] font-bold hover:bg-white/20 transition-colors bg-white/10 backdrop-blur-lg px-3 py-1.5 rounded-xl border border-white/10">
            <Info size={12} />
            DETAILS
          </button>
        </div>

        {/* Title & Location */}
        <div className="space-y-1">
          <h3 className="text-xl font-bold leading-tight line-clamp-2 tracking-tight">
            {title}
          </h3>
          <div className="flex items-center gap-1.5 text-white/70 text-xs">
            <MapPin size={12} className="text-[#1572D3]" />
            <span className="font-medium truncate">{mrtLocation}</span>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="flex items-center flex-wrap gap-2">
          <span className="px-3 py-1 bg-white/5 backdrop-blur-sm rounded-full text-[9px] font-black tracking-widest uppercase border border-white/10">
            {category}
          </span>
          <span className="px-3 py-1 bg-white/5 backdrop-blur-sm rounded-full text-[9px] font-black tracking-widest uppercase border border-white/10">
            TOURIST
          </span>
        </div>

        {/* View Map Button */}
        <button className="w-full flex justify-center items-center gap-2 px-4 py-3 bg-[#1572D3] rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg hover:bg-[#125ba8] transition-all active:scale-[0.98] mt-2">
          <Map size={14} />
          View Map
        </button>
      </div>
    </div>
  );
}
