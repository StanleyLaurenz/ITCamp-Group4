"use client";

import { useEffect, useState } from "react";
import {
  Cloud,
  X,
  RefreshCw,
  MapPin,
  Droplet,
  Wind,
  Navigation,
  Sunrise,
} from "react-feather";

interface WeatherData {
  temp: number;
  humidity: number;
  rainfall: number;
  windSpeed: number;
  windDir: number;
  condition: string;
  icon: string;
  location: string;
}

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  const fetchWeather = async () => {
    setLoading(true);
    try {
      const res = await fetch("/weather");
      const data = await res.json();
      setWeather(data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  const today = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="absolute top-6 right-6 z-[999] p-4 bg-[#1572D3] hover:bg-[#1261b5] text-white rounded-2xl shadow-[0_10px_25px_rgba(21,114,211,0.4)] transition-all duration-300 hover:scale-105 active:scale-95 border border-white/20"
      >
        <Cloud size={30} />
      </button>
    );
  }

  return (
    <div className="absolute top-6 right-6 z-[999] w-[340px] bg-white text-slate-800 rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-300">
      {/* Premium Header Container */}
      <div className="bg-[#1572D3] p-8 text-white relative overflow-hidden">
        {/* Background Decorative Circle */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />

        <div className="flex justify-between items-start relative z-10 mb-8">
          <div className="flex items-center gap-2 bg-black/10 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/90">
              Live: {today}
            </span>
          </div>
          <button
            onClick={() => setIsExpanded(false)}
            className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex items-end justify-between relative z-10">
          <div className="flex flex-col">
            <span className="text-7xl drop-shadow-md mb-2">
              {weather?.icon || "☀️"}
            </span>
            <p className="text-lg font-semibold tracking-tight">
              {weather?.condition}
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-start justify-end">
              <span className="text-7xl font-light tracking-tighter leading-none">
                {weather?.temp ?? "--"}
              </span>
              <span className="text-2xl font-medium mt-1">°</span>
            </div>
            <div className="flex items-center justify-end gap-1.5 text-white/70 mt-1">
              <MapPin size={12} />
              <span className="text-xs font-medium uppercase tracking-wider">
                {weather?.location}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Stats Content */}
      <div className="p-8">
        {loading ? (
          <div className="flex flex-col items-center py-10">
            <RefreshCw
              size={32}
              className="animate-spin text-[#1572D3]/30 mb-4"
            />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Refreshing Data
            </span>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {/* Stat Card 1: Humidity */}
              <div className="group flex flex-col p-5 bg-slate-50 hover:bg-blue-50 transition-colors rounded-[2rem] border border-slate-100">
                <div className="bg-white p-2 w-fit rounded-xl shadow-sm mb-3 group-hover:text-[#1572D3]">
                  <Droplet size={20} />
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                  Humidity
                </span>
                <span className="text-xl font-bold text-slate-800">
                  {weather?.humidity}%
                </span>
              </div>

              {/* Stat Card 2: Wind Speed */}
              <div className="group flex flex-col p-5 bg-slate-50 hover:bg-blue-50 transition-colors rounded-[2rem] border border-slate-100">
                <div className="bg-white p-2 w-fit rounded-xl shadow-sm mb-3 group-hover:text-[#1572D3]">
                  <Wind size={20} />
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                  Wind
                </span>
                <span className="text-xl font-bold text-slate-800">
                  {weather?.windSpeed} <span className="text-xs">kt</span>
                </span>
              </div>

              {/* Stat Card 3: Direction */}
              <div className="group flex flex-col p-5 bg-slate-50 hover:bg-blue-50 transition-colors rounded-[2rem] border border-slate-100">
                <div className="bg-white p-2 w-fit rounded-xl shadow-sm mb-3 group-hover:text-[#1572D3]">
                  <Navigation
                    size={20}
                    style={{ transform: `rotate(${weather?.windDir}deg)` }}
                    className="transition-transform duration-1000"
                  />
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                  Direction
                </span>
                <span className="text-xl font-bold text-slate-800">
                  {weather?.windDir}°
                </span>
              </div>

              {/* Stat Card 4: Rainfall */}
              <div className="group flex flex-col p-5 bg-slate-50 hover:bg-blue-50 transition-colors rounded-[2rem] border border-slate-100">
                <div className="bg-white p-2 w-fit rounded-xl shadow-sm mb-3 group-hover:text-[#1572D3]">
                  <Sunrise size={20} />
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                  Rainfall
                </span>
                <span className="text-xl font-bold text-slate-800">
                  {weather?.rainfall} <span className="text-xs">mm</span>
                </span>
              </div>
            </div>

            {/* Interactive Footer */}
            <button
              onClick={fetchWeather}
              disabled={loading}
              className="w-full py-4 bg-[#1572D3] hover:bg-[#1261b5] text-white rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 active:scale-[0.98]"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              Refresh Analytics
            </button>
          </>
        )}
      </div>
    </div>
  );
}
