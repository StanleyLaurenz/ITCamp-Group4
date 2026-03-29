"use client";

import React, { useState, useRef, useEffect } from "react";
import { Filter as FilterIcon, Star, X } from "react-feather";

interface FilterProps {
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  minRating: number;
  setMinRating: (rating: number) => void;
}

const CATEGORY_OPTIONS = [
  "Arts & Museum",
  "Culture & Heritage",
  "Nature & Parks",
  "Architecture",
  "Lifestyle",
];

export const Filter = ({
  selectedCategories,
  setSelectedCategories,
  minRating,
  setMinRating,
}: FilterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleCategory = (category: string) => {
    setSelectedCategories(
      selectedCategories.includes(category)
        ? selectedCategories.filter((c) => c !== category)
        : [...selectedCategories, category]
    );
  };

  return (
    <div className="relative" ref={filterRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          group bg-white border-[1px] rounded-xl flex gap-2 justify-center items-center 
          w-[48px] sm:w-[110px] h-[48px] transition-all duration-200 shrink-0
          ${isOpen ? "border-[#1572D3] shadow-md" : "border-[#DDD]"}
        `}
      >
        <FilterIcon
          size={18}
          className={isOpen ? "text-[#1572D3]" : "text-slate-600"}
        />
        <p className="hidden sm:block text-sm font-bold text-slate-700">
          Filter
        </p>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-72 bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 z-[100]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-black italic text-slate-900">Filters</h3>
            <button onClick={() => setIsOpen(false)}>
              <X size={18} className="text-slate-400" />
            </button>
          </div>

          {/* Categories */}
          <div className="space-y-3 mb-8">
            <p className="text-[11px] font-black tracking-widest text-slate-400">
              Categories
            </p>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_OPTIONS.map((cat) => (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-[10px] font-bold border transition-all ${
                    selectedCategories.includes(cat)
                      ? "bg-[#1572D3] text-white border-[#1572D3]"
                      : "bg-slate-50 text-slate-600 border-slate-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div className="space-y-3">
            <p className="text-[11px] font-black tracking-widest text-slate-400">
              Min Rating
            </p>
            <div className="flex bg-slate-50 p-1 rounded-2xl">
              {[3, 4, 5].map((num) => (
                <button
                  key={num}
                  onClick={() => setMinRating(num)}
                  className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-xl text-xs font-black transition-all ${
                    minRating === num
                      ? "bg-white text-[#1572D3] shadow-sm"
                      : "text-slate-400"
                  }`}
                >
                  <Star
                    size={12}
                    fill={minRating === num ? "currentColor" : "none"}
                  />
                  {num}.0+
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
