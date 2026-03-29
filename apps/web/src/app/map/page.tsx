import Navbar from "@/components/Navbar";
import { MapFeature } from "@/features/map/MapFeature";

export default function MapPage() {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar />
      <MapFeature />
    </div>
  );
}
