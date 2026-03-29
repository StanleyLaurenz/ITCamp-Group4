"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";
import LandmarkPopup from "./LandmarkPopup";
import type { Landmark } from "./types";

// Fix broken marker icons in Leaflet for Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

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
  showSavedOnly: boolean;
}

export default function MapInner({
  landmarks,
  savedIds,
  onToggleSave,
  isLoggedIn,
  showLandmarks,
  showTaxi: _showTaxi,
  showRain: _showRain,
  showSavedOnly,
}: MapInnerProps) {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Helper to find the selected landmark for the popup
  const selectedLandmark = landmarks.find((lm) => lm.id === selectedId) ?? null;

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={[1.3521, 103.8198]}
        zoom={12}
        className="w-full h-full"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapClickHandler onClose={() => setSelectedId(null)} />

        {landmarks.map((lm) => {
          const isSaved = savedIds.includes(lm.id);
          const isSelected = selectedId === lm.id;

          /**
           * UPDATED VISIBILITY LOGIC:
           * A marker is visible ONLY if its corresponding filter is active.
           * - If it's a Saved marker (Red), show it ONLY if showSavedOnly is true.
           * - If it's a Standard marker (Blue), show it ONLY if showLandmarks is true.
           */
          let shouldShow = false;

          if (isSaved) {
            // Red markers follow the 'Saved' toggle
            shouldShow = showSavedOnly;
          } else {
            // Blue markers follow the 'Landmarks' toggle
            shouldShow = showLandmarks;
          }

          if (!shouldShow) return null;

          return (
            <Marker
              key={lm.id}
              position={[lm.lat, lm.lng]}
              icon={createCustomMarker(isSelected, isSaved)}
              eventHandlers={{
                click: (e) => {
                  e.originalEvent.stopPropagation();
                  setSelectedId(lm.id);
                },
              }}
            />
          );
        })}
      </MapContainer>

      {selectedLandmark && (
        <LandmarkPopup
          landmark={selectedLandmark}
          isSaved={savedIds.includes(selectedLandmark.id)}
          onToggleSave={() => onToggleSave(selectedLandmark.id)}
          onClose={() => setSelectedId(null)}
          isLoggedIn={isLoggedIn}
        />
      )}
    </div>
  );
}
