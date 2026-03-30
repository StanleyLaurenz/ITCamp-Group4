"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation"; // Added for redirect
import { useAuth } from "@/context/AuthContext"; // Added for auth check
import {
  X,
  Clock,
  MapPin,
  Globe,
  Heart,
  Map,
  ExternalLink,
  Star,
} from "react-feather";
import Link from "next/link";

interface DetailsPopUpProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
  isFavorite: boolean;
  onFavoriteToggle: () => void;
  imageUrl?: string;
  rating: number;
}

export function DetailsPopUp({
  isOpen,
  onClose,
  data,
  isFavorite,
  onFavoriteToggle,
  imageUrl,
  rating,
}: DetailsPopUpProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen || !data) return null;

  const { properties } = data;

  const displayImage =
    imageUrl ||
    "https://images.unsplash.com/photo-1554904077-80928a30ef1d?q=80&w=600";

  // Auth Guard for Favorite Toggle
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      // Encode current path to return here after login
      const returnUrl = encodeURIComponent(pathname);
      router.push(`/login?returnTo=${returnUrl}`);
      return;
    }

    onFavoriteToggle();
  };

  function formatOpeningHours(rawHours: string) {
    if (!rawHours) return { day: "Daily", time: "24 Hours" };
    const cleanHours = rawHours.replace(/â€“/g, "-").replace(/–/g, "-").trim();
    const parts = cleanHours.split(/:(.*)/);

    if (parts.length >= 2) {
      return { day: parts[0].trim(), time: parts[1].trim() };
    }
    return { day: "Opening Hours", time: cleanHours };
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className="relative z-[9999] w-full max-w-2xl max-h-[90vh] bg-white rounded-[40px] shadow-2xl overflow-y-auto no-scrollbar animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <div className="sticky top-0 z-[110] w-full h-0">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-3 bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30 text-white hover:bg-white/40 transition-all active:scale-90 shadow-lg"
          >
            <X size={20} />
          </button>
        </div>

        {/* Hero Image Section */}
        <div className="relative h-72 sm:h-96 w-full">
          <img
            src={displayImage}
            alt={properties.PAGETITLE}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/20" />

          {/* Favorite Button on Image */}
          <div className="absolute top-6 left-6 z-[110]">
            <button
              onClick={handleFavoriteClick}
              className="p-3 bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30 text-white hover:bg-white/40 transition-all active:scale-90 shadow-lg"
            >
              <Heart
                size={20}
                className={
                  isFavorite ? "fill-red-500 text-red-500" : "text-white"
                }
              />
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8 sm:p-10 -mt-16 relative bg-white rounded-t-[48px]">
          <div className="space-y-8">
            {/* Title & Location */}
            <div className="space-y-3">
              <h2 className="text-3xl font-black italic tracking-tighter text-slate-900 leading-[0.9]">
                {properties.PAGETITLE}
              </h2>
              <div className="flex items-center gap-2 text-slate-500 font-bold text-sm">
                <MapPin size={16} className="text-[#1572D3]" />
                <span className="opacity-80">
                  {properties.ADDRESS || "Singapore Landmark"}
                </span>
              </div>
            </div>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 auto-rows-fr">
              <div className="sm:row-span-2 p-5 bg-slate-50 rounded-[28px] border border-slate-100 flex flex-col justify-center gap-4">
                <div className="space-y-3 text-center">
                  <div className="flex items-center justify-center gap-2.5">
                    <div className="p-2 bg-white rounded-xl text-[#1572D3] shadow-sm">
                      <Clock size={16} />
                    </div>
                    <span className="text-[10px] font-black text-[#1572D3] uppercase tracking-widest">
                      {formatOpeningHours(properties.OPENING_HOURS).day}
                    </span>
                  </div>
                  <p className="text-[18px] font-black italic tracking-tighter text-slate-900 leading-tight">
                    {formatOpeningHours(properties.OPENING_HOURS).time}
                  </p>
                </div>
              </div>

              <a
                href={properties.EXTERNAL_LINK || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-4 rounded-[28px] border flex items-center gap-3 transition-all group ${
                  properties.EXTERNAL_LINK
                    ? "bg-[#1572D3]/5 border-[#1572D3]/10 hover:bg-[#1572D3]/10"
                    : "bg-slate-50 border-slate-100 opacity-50 cursor-not-allowed"
                }`}
              >
                <div className="p-2 bg-[#1572D3] rounded-xl text-white shadow-md">
                  <Globe size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#1572D3]/60">
                    Official Site
                  </p>
                  <p className="text-sm font-black italic text-[#1572D3]">
                    Visit Website
                  </p>
                </div>
              </a>

              <div className="p-4 bg-slate-50 rounded-[28px] border border-slate-100 flex items-center gap-3">
                <div className="p-2 bg-white rounded-xl text-yellow-500 shadow-sm">
                  <Star size={16} className="fill-yellow-500" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Rating
                  </p>
                  <p className="text-sm font-black italic text-slate-900">
                    {rating.toFixed(1)} / 5.0
                  </p>
                </div>
              </div>
            </div>

            {/* Overview */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-1 bg-[#1572D3] rounded-full" />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Overview
                </p>
              </div>
              <p className="text-slate-600 leading-relaxed font-medium">
                {properties.OVERVIEW ||
                  "Experience one of Singapore's most iconic destinations."}
              </p>
            </div>

            {/* Back to Map Button */}
            <Link
              href={`/map?selectedId=${data.properties.OBJECTID_1}`}
              className="flex items-center justify-center gap-3 w-full py-5 bg-[#1572D3] !text-white font-black tracking-widest text-xs rounded-[24px] shadow-2xl shadow-[#1572D3]/40 hover:bg-[#125ba8] transition-all active:scale-[0.98]"
            >
              <Map size={18} />
              View on Map
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
