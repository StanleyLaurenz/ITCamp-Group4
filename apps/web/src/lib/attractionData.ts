import type { Landmark } from "@/features/map/types";
import { getCategories } from "@/utils/categorize";
import { getStaticRating } from "@/utils/generateRating";

export type AttractionRecord = {
  properties?: {
    OBJECTID_1?: number | string;
    PAGETITLE?: string;
    ADDRESS?: string;
    OVERVIEW?: string;
    [key: string]: unknown;
  };
  geometry?: { coordinates?: number[] };
  imageUrl?: string | null;
  nearestMRT?: string;
  [key: string]: unknown;
};

export type EnrichedAttraction = AttractionRecord & {
  id: number;
  rating: number;
  categories: string[];
};

/**
 * Adds stable id, rating, and categories for list/card UIs.
 */
export function enrichAttractionForList(
  item: AttractionRecord
): EnrichedAttraction {
  const id = Number(item.properties?.OBJECTID_1);
  return {
    ...item,
    id,
    rating: getStaticRating(id),
    categories: getCategories(item),
  };
}

/**
 * Normalizes API features for the Leaflet map layer.
 */
export function rawAttractionToLandmark(item: AttractionRecord): Landmark {
  const id = Number(item.properties?.OBJECTID_1);
  const coords = item.geometry?.coordinates || [0, 0];

  return {
    id,
    title: item.properties?.PAGETITLE || "Unknown",
    address: item.properties?.ADDRESS || "Singapore",
    overview: String(item.properties?.OVERVIEW ?? ""),
    lat: coords[1],
    lng: coords[0],
    imageUrl: item.imageUrl ?? null,
    rating: getStaticRating(id),
    categories: getCategories(item),
    nearestMRT: item.nearestMRT || "",
  };
}
