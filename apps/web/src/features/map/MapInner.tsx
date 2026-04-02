"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  CircleMarker,
} from "react-leaflet";
import { useState, useEffect } from "react";
import LandmarkPopup from "./LandmarkPopup";
import { MRT_LINE_COLORS } from "./mrtLineColors";
import type { Landmark, MrtStationMarker, Taxi, WeatherStation } from "./types";
import { Popup, useMap } from "react-leaflet";

const TAXI_STYLE = {
  radius: 4,
  fillColor: "#facc15", // Bright Yellow
  color: "#a16207", // Dark Yellow border
  weight: 1,
  fillOpacity: 0.9,
};

// Fix broken marker icons in Leaflet for Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const createMRTIcon = (stationLines: string[], currentZoom: number) => {
  const colors = stationLines.map((line) => MRT_LINE_COLORS[line] || "#748477");

  const baseSize = currentZoom < 12 ? 12 : currentZoom > 14 ? 32 : 24;
  const innerSize = baseSize * 0.6;
  const iconOffset = baseSize / 2;

  const backgroundStyle =
    colors.length > 1
      ? `background: conic-gradient(${colors
          .map(
            (c, i) =>
              `${c} ${i * (360 / colors.length)}deg ${
                (i + 1) * (360 / colors.length)
              }deg`
          )
          .join(", ")});`
      : `background: ${colors[0]};`;

  return L.divIcon({
    className: "custom-mrt-icon",
    html: `
      <div class="relative flex items-center justify-center transition-all duration-300" 
           style="width: ${baseSize}px; height: ${baseSize}px;">
        
        <div class="absolute w-full h-full rounded-[4px] rotate-45 shadow-sm border border-white/30" 
             style="${backgroundStyle}">
        </div>
        
        ${
          currentZoom > 11
            ? `
          <div class="absolute bg-slate-50 rounded-full flex items-center justify-center z-10 shadow-inner"
               style="width: ${innerSize}px; height: ${innerSize}px;">
             <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1572D3" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
               <path d="M7 15h10" />
               <path d="M12 15V5" />
               <path d="M7 11h10" />
               <rect x="3" y="5" width="18" height="15" rx="2" />
               <path d="m8 21-2-2" />
               <path d="m16 21 2-2" />
             </svg>
          </div>
        `
            : ""
        }
      </div>
    `,
    iconSize: [baseSize, baseSize],
    iconAnchor: [iconOffset, iconOffset],
  });
};

/**
 * Creates a custom SVG Pin marker.
 * Blue (#1572D3) for standard landmarks, Red (#EF4444) for saved ones.
 */
const createCustomMarker = (isSelected: boolean, isSaved: boolean) => {
  const markerColor = isSaved ? "#EF4444" : "#1572D3";

  return L.divIcon({
    className: "custom-marker-icon",
    html: `<div class="group relative flex items-center justify-center transition-all duration-200 ${
      isSelected ? "scale-125 z-[1000]" : "hover:scale-110"
    }">
      <svg 
        width="32" 
        height="32" 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        class="drop-shadow-lg"
      >
        <path 
          d="M12 21C16 17.5 19 14.4091 19 10.5C19 6.63401 15.866 3.5 12 3.5C8.13401 3.5 5 6.63401 5 10.5C5 14.4091 8 17.5 12 21Z" 
          fill="${markerColor}" 
          stroke="white" 
          stroke-width="1.5"
        />
        <circle cx="12" cy="10.5" r="2.5" fill="white" />
      </svg>
      ${
        isSelected
          ? `<div class="absolute inset-0 -z-10 h-8 w-8 animate-ping rounded-full opacity-20" style="background-color: ${markerColor}"></div>`
          : ""
      }
    </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });
};

function ZoomHandler({
  onZoomChange,
}: {
  onZoomChange: (zoom: number) => void;
}) {
  const map = useMapEvents({
    zoomend: () => {
      onZoomChange(map.getZoom());
    },
  });
  return null;
}

function MapClickHandler({ onClose }: { onClose: () => void }) {
  useMapEvents({ click: onClose });
  return null;
}

interface MapInnerProps {
  landmarks: Landmark[];
  savedIds: number[];
  onToggleSave: (id: number) => void;
  isLoggedIn: boolean;
  showLandmarks: boolean;
  showTaxi: boolean;
  showRain: boolean;
  taxis: Taxi[];
  showSavedOnly: boolean;
  initialSelectedId: number | null;
  showMRT: boolean;
  mrtData: MrtStationMarker[] | null;
  activeLines: string[]; // ADD THIS
}

interface MapControllerProps {
  initialSelectedId: number | null;
  landmarks: Landmark[];
  setSelectedId: (id: number | null) => void;
}

function MapController({
  initialSelectedId,
  landmarks,
  setSelectedId,
}: MapControllerProps) {
  const map = useMap();

  useEffect(() => {
    if (initialSelectedId) {
      const target = landmarks.find(
        (lm: Landmark) => lm.id === initialSelectedId
      );
      if (target) {
        // Use setView for an instant jump if flyTo is too laggy,
        // OR optimize flyTo like this:
        map.flyTo([target.lat, target.lng], 16, {
          duration: 0.8, // Faster duration = less frames to calculate
          easeLinearity: 0.5,
          noMoveStart: true, // Prevents unnecessary event firing
        });
        setSelectedId(target.id);
      }
    }
  }, [initialSelectedId, landmarks, map, setSelectedId]);

  return null;
}

export default function MapInner({
  landmarks,
  savedIds,
  onToggleSave,
  initialSelectedId,
  isLoggedIn,
  showLandmarks,
  showTaxi,
  taxis,
  showRain: _showRain, // destructured cause it's not used inside the function yet
  showSavedOnly,
  showMRT,
  mrtData,
  activeLines,
}: MapInnerProps) {
  const [selectedId, setSelectedId] = useState<number | null>(
    initialSelectedId
  );
  const [currentZoom, setCurrentZoom] = useState(12); // Default zoom level
  const [weatherData, setWeatherData] = useState<WeatherStation[]>([]);

  const handleClose = () => {
    setSelectedId(null);
  };

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={[1.3521, 103.8198]}
        preferCanvas={true}
        zoom={12}
        className="w-full h-full"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* Track zoom changes */}
        <ZoomHandler onZoomChange={setCurrentZoom} />

        <MapController
          landmarks={landmarks}
          initialSelectedId={initialSelectedId}
          setSelectedId={setSelectedId}
        />
        <MapClickHandler onClose={() => setSelectedId(null)} />

        {/* --- TAXI LAYER --- */}
        {/* --- TAXI LAYER --- */}
        {/* --- OPTIMIZED TAXI LAYER --- */}
        {showTaxi &&
          Array.isArray(taxis) &&
          taxis.map((taxi, i) => (
            <CircleMarker
              key={`taxi-${i}`}
              center={[taxi.lat, taxi.lng]}
              {...TAXI_STYLE}
              // CircleMarker is canvas-based, which is way smoother than Markers
            >
              <Popup className="taxi-popup">
                <div className="flex items-center gap-2 p-1">
                  <div className="w-2 h-2 rounded-full bg-yellow-500" />
                  <span className="text-[10px] font-bold uppercase text-slate-700">
                    Taxi Available
                  </span>
                </div>
              </Popup>
            </CircleMarker>
          ))}

        {/* --- MRT LAYER --- */}
        {showMRT &&
          Array.isArray(mrtData) &&
          mrtData
            .filter((st: MrtStationMarker) =>
              st.lines.some((l: string) => activeLines.includes(l))
            )
            .map((st: MrtStationMarker, i: number) => (
              <Marker
                key={`mrt-${st.name}-${i}`} // Use station name for a more unique key
                position={st.position} // Uses the 'position' key [lat, lng] from your backend
                icon={createMRTIcon(st.lines, currentZoom)} // Uses the 'lines' key from your backend
              >
                <Popup className="mrt-popup-custom">
                  <div className="p-3 min-w-[180px] font-sans bg-white/95 backdrop-blur-sm rounded-xl">
                    {/* Header with MRT Icon */}
                    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-900 text-white shadow-lg">
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect x="4" y="3" width="16" height="15" rx="2" />
                          <path d="M4 11h16M8 18l-2 3M16 18l2 3" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-base font-black uppercase text-slate-900 leading-tight tracking-tight">
                          {st.name}
                        </h4>
                      </div>
                    </div>

                    {/* Lines Section */}
                    <div className="space-y-2">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                        Service Lines
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {st.lines.map((line: string) => (
                          <div
                            key={line}
                            className="flex items-center gap-1.5 px-2 py-1 rounded-md text-[9px] font-black text-white shadow-sm transition-transform hover:scale-105"
                            style={{
                              backgroundColor: MRT_LINE_COLORS[line] || "#748477",
                            }}
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                            {line.replace("-", " ").replace(" LINE", "")}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}

        {/* --- LANDMARKS LAYER --- */}
        {landmarks.map((lm) => {
          const isSaved = savedIds.includes(lm.id);
          const isSelected = selectedId === lm.id;
          const shouldShow = showLandmarks || (showSavedOnly && isSaved);
          if (!shouldShow) return null;

          return (
            <Marker
              key={lm.id}
              position={[lm.lat, lm.lng]}
              icon={createCustomMarker(isSelected, isSaved)}
              eventHandlers={{ click: () => setSelectedId(lm.id) }}
            >
              {isSelected && (
                <Popup
                  className="custom-landmark-popup"
                  offset={[0, -32]}
                  closeButton={false}
                >
                  <LandmarkPopup
                    landmark={lm}
                    isSaved={isSaved}
                    onToggleSave={() => onToggleSave(lm.id)}
                    onClose={handleClose}
                    isLoggedIn={isLoggedIn}
                  />
                </Popup>
              )}
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
