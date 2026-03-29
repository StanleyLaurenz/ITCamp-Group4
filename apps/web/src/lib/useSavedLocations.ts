"use client";

import { useEffect, useMemo, useState } from "react";

const SAVED_LOCATIONS_UPDATED_EVENT = "saved-locations-updated";

function normalizeIds(values: unknown) {
  if (!Array.isArray(values)) {
    return [];
  }

  return values
    .map((value) => Number(value))
    .filter(
      (value, index, array) =>
        Number.isFinite(value) && array.indexOf(value) === index,
    );
}

function parseIds(rawValue: string | null) {
  if (!rawValue) {
    return [];
  }

  try {
    const parsed = JSON.parse(rawValue) as unknown;

    if (Array.isArray(parsed)) {
      return normalizeIds(parsed);
    }

    if (parsed && typeof parsed === "object" && "savedOrder" in parsed) {
      return normalizeIds((parsed as { savedOrder?: unknown }).savedOrder);
    }

    return [];
  } catch {
    return [];
  }
}

export function useSavedLocations(userId: string | null, enabled: boolean) {
  const storageKey = useMemo(
    () => (userId ? `savedLocations:${userId}` : null),
    [userId],
  );
  const orderStorageKey = useMemo(
    () => (userId ? `savedLocationsOrder:${userId}` : null),
    [userId],
  );
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [savedOrder, setSavedOrder] = useState<number[]>([]);

  useEffect(() => {
    if (!enabled || !storageKey || !orderStorageKey) {
      setSavedIds([]);
      setSavedOrder([]);
      return;
    }

    const syncFromStorage = () => {
      const ids = parseIds(window.localStorage.getItem(storageKey));
      const order = parseIds(window.localStorage.getItem(orderStorageKey));
      const mergedOrder = [
        ...order.filter((id) => ids.includes(id)),
        ...ids.filter((id) => !order.includes(id)),
      ];

      setSavedIds(ids);
      setSavedOrder(mergedOrder);
    };

    syncFromStorage();

    function handleStorage(event: StorageEvent) {
      if (event.key === storageKey || event.key === orderStorageKey) {
        syncFromStorage();
      }
    }

    function handleSavedLocationsUpdated(event: Event) {
      const detail = (
        event as CustomEvent<{ storageKey?: string; orderStorageKey?: string }>
      ).detail;

      if (
        detail?.storageKey === storageKey ||
        detail?.orderStorageKey === orderStorageKey
      ) {
        syncFromStorage();
      }
    }

    window.addEventListener("storage", handleStorage);
    window.addEventListener(
      SAVED_LOCATIONS_UPDATED_EVENT,
      handleSavedLocationsUpdated,
    );

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(
        SAVED_LOCATIONS_UPDATED_EVENT,
        handleSavedLocationsUpdated,
      );
    };
  }, [enabled, orderStorageKey, storageKey]);

  const toggleSave = (id: number) => {
    if (!enabled || !storageKey || !orderStorageKey) {
      return;
    }

    const currentIds = parseIds(window.localStorage.getItem(storageKey));
    const currentOrder = parseIds(window.localStorage.getItem(orderStorageKey));
    const nextIds = currentIds.includes(id)
      ? currentIds.filter((itemId) => itemId !== id)
      : [...currentIds, id];
    const nextOrder = nextIds.includes(id)
      ? [id, ...currentOrder.filter((itemId) => itemId !== id)]
      : currentOrder.filter((itemId) => itemId !== id);

    window.localStorage.setItem(storageKey, JSON.stringify(nextIds));
    window.localStorage.setItem(orderStorageKey, JSON.stringify(nextOrder));

    setSavedIds(nextIds);
    setSavedOrder(nextOrder);

    window.dispatchEvent(
      new CustomEvent(SAVED_LOCATIONS_UPDATED_EVENT, {
        detail: { storageKey, orderStorageKey },
      }),
    );
  };

  return { savedIds, savedOrder, toggleSave };
}
