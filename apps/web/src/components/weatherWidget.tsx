'use client';

import { useEffect, useState } from 'react';

interface WeatherData {
  temp: number;
  rainfall: number;
  condition: string;
  icon: string;
  location: string;
}

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(true);

  const fetchWeather = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/api/weather');
      const data = await res.json();
      setWeather(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  const today = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  if (!visible) return null;

  return (
    <div className="absolute top-4 right-4 z-[999] w-48 bg-[#1e3a5f]/90 text-white rounded-2xl p-4 shadow-xl backdrop-blur-sm border border-blue-400/20">
      
      {/* Top row: date + close */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-xs text-blue-200">{today}</span>
        <button
          onClick={() => setVisible(false)}
          className="text-blue-300 hover:text-white text-sm"
        >
          ✕
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-center py-2 text-blue-200">Loading...</p>
      ) : weather ? (
        <>
          {/* Icon + Temperature */}
          <div className="flex items-center justify-between mb-1">
            <span className="text-4xl">{weather.icon}</span>
            <span className="text-4xl font-light">{weather.temp}°</span>
          </div>

          {/* Condition */}
          <p className="text-sm font-medium">{weather.condition}</p>

          {/* Extra stats */}
          <div className="mt-2 text-xs text-blue-200 space-y-1">
            <p>🌧️ Rainfall: {weather.rainfall} mm</p>
          </div>

          {/* Location + Refresh */}
          <div className="flex justify-between items-center mt-3">
            <p className="text-xs text-blue-300">{weather.location}</p>
            <button
              onClick={fetchWeather}
              className="text-blue-300 hover:text-white text-sm"
            >
              ↻
            </button>
          </div>
        </>
      ) : (
        <p className="text-sm text-red-400">Failed to load</p>
      )}

    </div>
  );
}