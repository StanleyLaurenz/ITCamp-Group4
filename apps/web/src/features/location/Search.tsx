"use client";

import { useState, useEffect } from "react";
import { Search as SearchIcon } from "react-feather";

interface SearchProps {
  onSearch: (query: string) => void;
}

export function Search({ onSearch }: SearchProps) {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    // 500ms delay
    const timer = setTimeout(() => {
      onSearch(inputValue);
    }, 500);

    return () => clearTimeout(timer);
  }, [inputValue, onSearch]);

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="block w-full rounded-full border border-slate-200 bg-white py-3 pl-12 text-sm focus:border-[#1572D3] focus:ring-1 focus:ring-[#1572D3] shadow-sm transition-all"
        placeholder="Search landmarks..."
      />
      <div className="absolute top-[0.55rem] left-3 flex items-center justify-center w-7 h-7 rounded-full bg-[#1572D3]">
        <SearchIcon className="text-white" size={14} />
      </div>
    </div>
  );
}
