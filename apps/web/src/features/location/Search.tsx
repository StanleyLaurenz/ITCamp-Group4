"use client";

import { Search as SearchIcon } from "react-feather";

export function Search() {
  return (
    // Removed fixed max-w-md from the inner div to let the parent control it
    <div className="relative w-full ">
      <input
        type="text"
        className="block w-full rounded-full border border-slate-200 bg-white py-3 pl-12 text-sm placeholder-slate-500 focus:border-[#1572D3] focus:outline-none focus:ring-1 focus:ring-[#1572D3] shadow-sm transition-all"
        placeholder="Search landmarks..."
      />

      <div className="absolute top-[0.55rem] left-3 flex items-center justify-center w-7 h-7 rounded-full bg-[#1572D3] hover:bg-[#125ba8] cursor-pointer transition-colors duration-300">
        <SearchIcon className="text-white" size={14} />
      </div>
    </div>
  );
}
