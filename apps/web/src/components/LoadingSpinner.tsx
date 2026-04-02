"use client";

export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center p-10">
      <div className="relative">
        {/* Animated outer ring */}
        <div className="w-16 h-16 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin" />
      </div>
      <span className="mt-4 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
        Loading Trippa
      </span>
    </div>
  );
}