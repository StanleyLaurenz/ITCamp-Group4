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
} from "react-feather";

interface WeatherData {
  temp: number;
  humidity: number;
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

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="absolute top-6 right-6 z-[999] p-3 bg-[#1572D3]/80 hover:bg-[#1572D3] text-white rounded-xl shadow-lg backdrop-blur-md border border-white/20 transition-all duration-300 hover:scale-105 active:scale-95"
      >
        <Cloud size={24} />
      </button>
    );
  }

  return (
    <div className="absolute top-6 right-6 z-[999] w-[300px] bg-[#1e3a5f]/80 text-white rounded-[2rem] shadow-2xl backdrop-blur-xl border border-white/10 overflow-hidden animate-in fade-in zoom-in duration-300">
      {/* Header Section */}
      <div className="p-5 pb-2">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2 bg-white/10 px-2.5 py-1 rounded-full border border-white/5">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            <span className="text-[9px] font-bold uppercase tracking-wider">
              Live Station
            </span>
          </div>
          <button
            onClick={() => setIsExpanded(false)}
            className="hover:bg-white/10 p-1.5 rounded-full transition-colors"
          >
            <X size={16} className="opacity-60 hover:opacity-100" />
          </button>
        </div>

        <div className="flex items-center justify-between px-1">
          <span className="text-5xl drop-shadow-md">
            {weather?.icon || "☀️"}
          </span>
          <div className="text-right">
            <div className="flex items-start justify-end">
              <span className="text-5xl font-light tracking-tighter leading-none">
                {weather?.temp ?? "--"}
              </span>
              <span className="text-xl font-medium mt-0.5">°</span>
            </div>
            <p className="text-[11px] font-bold text-blue-300 uppercase tracking-tighter">
              {weather?.condition}
            </p>
          </div>
        </div>
      </div>

      {/* Grid Section (Glass Cards) */}
      <div className="p-5 pt-4">
        {loading ? (
          <div className="flex flex-col items-center py-6">
            <RefreshCw size={20} className="animate-spin opacity-40 mb-2" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-2.5 mb-5">
              {/* Humidity */}
              <div className="flex flex-col p-3 bg-white/5 rounded-2xl border border-white/5">
                <Droplet size={16} className="text-[#1572D3] mb-2" />
                <span className="text-[8px] font-bold text-white/40 uppercase mb-0.5">
                  Humidity
                </span>
                <span className="text-sm font-bold">{weather?.humidity}%</span>
              </div>

              {/* Wind */}
              <div className="flex flex-col p-3 bg-white/5 rounded-2xl border border-white/5">
                <Wind size={16} className="text-[#1572D3] mb-2" />
                <span className="text-[8px] font-bold text-white/40 uppercase mb-0.5">
                  Wind
                </span>
                <span className="text-sm font-bold">
                  {weather?.windSpeed}{" "}
                  <span className="text-[10px] opacity-50 font-normal">kt</span>
                </span>
              </div>

              {/* Direction */}
              <div className="col-span-2 flex flex-col p-3 bg-white/5 rounded-2xl border border-white/5">
                <Navigation
                  size={16}
                  style={{ transform: `rotate(${weather?.windDir}deg)` }}
                  className="text-[#1572D3] mb-2 transition-transform duration-1000"
                />
                <span className="text-[8px] font-bold text-white/40 uppercase mb-0.5">
                  Direction
                </span>
                <span className="text-sm font-bold">{weather?.windDir}°</span>
              </div>
            </div>

            {/* Compact Footer */}
            <div className="flex items-center justify-between border-t border-white/10 pt-4 px-1">
              <div className="flex items-center gap-2 opacity-60">
                <MapPin size={12} />
                <span className="text-[10px] font-bold truncate max-w-[120px]">
                  {weather?.location}
                </span>
              </div>
              <button
                onClick={fetchWeather}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <RefreshCw
                  size={14}
                  className={loading ? "animate-spin" : ""}
                />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}