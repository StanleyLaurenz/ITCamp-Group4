import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import { MapFeature } from "@/features/map/MapFeature";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export default function MapPage() {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar />
      <Suspense
        fallback={
          <div className="relative flex-1 w-full flex items-center justify-center bg-slate-50">
            <LoadingSpinner />
          </div>
        }
      >
        <MapFeature />
      </Suspense>
    </div>
  );
}
