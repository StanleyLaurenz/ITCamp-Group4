"use client";

import { useEffect, useMemo, useState } from "react";

function parseSavedIds(rawValue: string | null) {
  if (!rawValue) {
    return [];
  }

  try {
    const parsed = JSON.parse(rawValue) as unknown;

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map((value) => Number(value))
      .filter((value) => Number.isFinite(value));
  } catch {
    return [];
  }
}

export function useSavedLocations(userId: string | null, enabled: boolean) {
  const storageKey = useMemo(
    () => (userId ? `savedLocations:${userId}` : null),
    [userId],
  );
  const [savedIds, setSavedIds] = useState<number[]>([]);

  useEffect(() => {
    if (!enabled || !storageKey) {
      setSavedIds([]);
      return;
    }

    setSavedIds(parseSavedIds(window.localStorage.getItem(storageKey)));

    function handleStorage(event: StorageEvent) {
      if (event.key === storageKey) {
        setSavedIds(parseSavedIds(event.newValue));
      }
    }

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, [enabled, storageKey]);

  const toggleSave = (id: number) => {
    if (!enabled || !storageKey) {
      return;
    }

    setSavedIds((prev) => {
      const next = prev.includes(id)
        ? prev.filter((itemId) => itemId !== id)
        : [...prev, id];

      window.localStorage.setItem(storageKey, JSON.stringify(next));

      return next;
    });
  };

  return { savedIds, toggleSave };
}
