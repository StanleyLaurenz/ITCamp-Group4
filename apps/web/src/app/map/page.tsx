import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { MapFeature } from "@/features/map/MapFeature";

export default function MapPage() {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar />
      <Suspense
        fallback={
          <div className="flex flex-1 items-center justify-center bg-slate-50">
            <LoadingSpinner />
          </div>
        }
      >
        <MapFeature />
      </Suspense>
    </div>
  );
}
