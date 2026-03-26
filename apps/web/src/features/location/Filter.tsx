"use client";

import React from "react";
import { Filter as FilterIcon } from "react-feather";

export const Filter = () => {
  return (
    <button
      className="
        group bg-white border-[1px] border-[#DDD] rounded-md
        flex gap-2 justify-center items-center 
        w-[48px] sm:w-[110px] h-[48px]  /* Square on mobile, wide on desktop */
        transition-all duration-200 ease-in-out
        hover:border-[#1572D3] hover:shadow-md active:scale-95
        shrink-0 /* Prevents the button from squishing */
      "
    >
      <FilterIcon className="h-5 w-5 text-slate-600 group-hover:text-[#1572D3] transition-colors" />
      {/* Hidden on extra small screens, shown as block on small+ */}
      <p className="hidden sm:block text-sm font-medium text-slate-700 group-hover:text-[#1572D3] transition-colors">
        Filter
      </p>
    </button>
  );
};
