import type { PropsWithChildren } from "react";
import Link from "next/link";

export function AppLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#ffffff,_#eef5fb_45%,_#d7e7f4)] text-ink">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 sm:px-10">
        {children}
      </div>
    </div>
  );
}
