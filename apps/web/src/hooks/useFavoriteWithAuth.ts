"use client";

import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

/**
 * Heart / favorite actions: redirect guests to login with return path, else run toggle.
 */
export function useFavoriteWithAuth(onAuthenticatedToggle: () => void) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();

  function handleFavoriteClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      router.push(`/login?returnTo=${encodeURIComponent(pathname)}`);
      return;
    }

    onAuthenticatedToggle();
  }

  return { handleFavoriteClick };
}
