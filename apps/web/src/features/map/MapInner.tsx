"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";
import LandmarkPopup from "./LandmarkPopup";
import type { Landmark } from "./types";

// Fix broken marker icons in webpack / Next.js builds
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)
  ._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Closes the popup when the user clicks the map background
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
}

export default function MapInner({
  landmarks,
  savedIds,
  onToggleSave,
  isLoggedIn,
  showLandmarks,
  showTaxi: _showTaxi,
}: MapInnerProps) {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const selectedLandmark =
    showLandmarks ? landmarks.find((lm) => lm.id === selectedId) ?? null : null;

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={[1.3521, 103.8198]}
        zoom={12}
        className="w-full h-full"
        zoomControl={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Closes popup on background click */}
        <MapClickHandler onClose={() => setSelectedId(null)} />

        {/* One marker per landmark */}
        {showLandmarks &&
          landmarks.map((lm) => (
            <Marker
              key={lm.id}
              position={[lm.lat, lm.lng]}
              eventHandlers={{
                click: (e) => {
                  // Prevent MapClickHandler from immediately closing the popup
                  e.originalEvent.stopPropagation();
                  setSelectedId(lm.id);
                },
              }}
            />
          ))}
      </MapContainer>

      {/* Floating popup card — rendered outside MapContainer so it's a normal DOM element */}
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
