"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, useMapEvents, Circle } from "react-leaflet";
import { useState, useEffect } from "react";
import LandmarkPopup from "./LandmarkPopup";
import type { Landmark, WeatherStation } from "./types";
import { Popup, useMap } from "react-leaflet";

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
    html: `<div class="group relative flex items-center justify-center transition-all duration-200 ${isSelected ? "scale-125 z-[1000]" : "hover:scale-110"
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
      ${isSelected
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
  initialSelectedId: number | null;
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
  showTaxi: _showTaxi,
  showRain,
  showSavedOnly,
}: MapInnerProps) {
  const [selectedId, setSelectedId] = useState<number | null>(
    initialSelectedId
  );
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

        <MapController
          initialSelectedId={initialSelectedId}
          landmarks={landmarks}
          setSelectedId={setSelectedId}
        />

        <MapClickHandler onClose={() => setSelectedId(null)} />

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
              eventHandlers={{
                click: () => {
                  setSelectedId(lm.id);
                },
                add: (e) => {
                  if (lm.id === initialSelectedId) {
                    e.target.openPopup();
                  }
                },
                popupclose: () => {
                  if (selectedId === lm.id) {
                    setSelectedId(null);
                  }
                },
              }}
            >
              {/* Anchor the card to the marker */}
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
