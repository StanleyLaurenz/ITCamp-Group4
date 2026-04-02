import type { ReactNode } from "react";
import Navbar from "@/components/Navbar";

export function AuthPageLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex items-center justify-center py-20 px-4">
        <div className="bg-white rounded-lg shadow-md w-full max-w-sm p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
