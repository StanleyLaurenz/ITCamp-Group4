import { Suspense } from "react";
import { LocationPage } from "@/features/location/LocationPage";
import Navbar from "@/components/Navbar";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export default function Page() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      {/* Wrap the component using useSearchParams in Suspense.
          This allows Next.js to prerender the rest of the page 
          while waiting for client-side search params.
      */}
      <Suspense
        fallback={
          <div className="flex h-[50vh] items-center justify-center">
            <LoadingSpinner />
          </div>
        }
      >
        <LocationPage />
      </Suspense>
    </main>
  );
}