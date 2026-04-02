// Fetching Data to get Tourist Attractions Locations, fetching photos from pexels for each locations, finding the nearest MRT Station

import type {
  NextFunction,
  Request,
  Response as ExpressResponse,
} from "express";

import { fetchOpenDatasetDownloadUrl } from "../lib/dataGovOpen.js";
import { calculateDistance } from "../utils/distance.js";
import { safeJsonParse } from "../utils/json.js";
import { loadMrtStations } from "./mrtController.js";

type AttractionFeature = {
  geometry?: {
    coordinates?: unknown;
  };
  properties?: {
    PAGETITLE?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
};

type GeoJsonResponse = {
  features?: AttractionFeature[];
};

type PexelsResponse = {
  photos?: Array<{
    src?: {
      large?: string;
    };
  }>;
};

const DATASET_ID = "d_0f2f47515425404e6c9d2a040dd87354";
const CACHE_TTL_MS = 5 * 60 * 1000;

let attractionsCache: {
  expiresAt: number;
  data: Array<AttractionFeature & { imageUrl: string | null }>;
} | null = null;

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

async function fetchBaseAttractions() {
  const downloadUrl = await fetchOpenDatasetDownloadUrl(
    DATASET_ID,
    "Data.gov attractions"
  );
  const dataResponse = await fetch(downloadUrl);

  if (!dataResponse.ok) {
    throw new Error(
      `Data.gov attractions download failed with HTTP ${dataResponse.status}`
    );
  }

  const geoJson = await safeJsonParse<GeoJsonResponse>(
    dataResponse,
    "Data.gov attractions"
  );

  if (!Array.isArray(geoJson.features)) {
    throw new Error(
      "Data.gov attractions payload did not include a features array"
    );
  }

  return geoJson.features;
}

async function fetchPexelsImage(title: string, apiKey: string) {
  const pexelsResponse = await fetch(
    `https://api.pexels.com/v1/search?query=${encodeURIComponent(
      `${title} Singapore`
    )}&per_page=1`,
    { headers: { Authorization: apiKey } }
  );

  if (!pexelsResponse.ok) {
    throw new Error(`Pexels search failed with HTTP ${pexelsResponse.status}`);
  }

  const pexelsJson = await safeJsonParse<PexelsResponse>(
    pexelsResponse,
    "Pexels search"
  );

  return pexelsJson.photos?.[0]?.src?.large ?? null;
}

async function enrichAttractionsWithImages(features: AttractionFeature[]) {
  const pexelsApiKey = process.env.PEXELS_API_KEY?.trim();

  if (!pexelsApiKey) {
    return features.map((feature) => ({
      ...feature,
      imageUrl: null,
    }));
  }

  const results = await Promise.allSettled(
    features.map(async (feature) => {
      const title = feature.properties?.PAGETITLE;

      if (!isNonEmptyString(title)) {
        return {
          ...feature,
          imageUrl: null,
        };
      }

      try {
        const imageUrl = await fetchPexelsImage(title, pexelsApiKey);

        return {
          ...feature,
          imageUrl,
        };
      } catch (error) {
        console.warn(`Skipping Pexels image for "${title}"`, error);

        return {
          ...feature,
          imageUrl: null,
        };
      }
    })
  );

  return results.map((result, index) => {
    if (result.status === "fulfilled") {
      return result.value;
    }

    console.warn("Falling back to null image for attraction", result.reason);

    return {
      ...features[index],
      imageUrl: null,
    };
  });
}

async function loadAttractions() {
  const now = Date.now();
  if (attractionsCache && attractionsCache.expiresAt > now)
    return attractionsCache.data;

  const [features, stations] = await Promise.all([
    fetchBaseAttractions(),
    loadMrtStations(),
  ]);

  const enrichedWithImages = await enrichAttractionsWithImages(features);

  const finalEnriched = enrichedWithImages.map((attr) => {
    const [lng, lat] = attr.geometry?.coordinates as [number, number];
    let nearest = { name: "Unknown", distance: Infinity };

    stations.forEach((st) => {
      const d = calculateDistance(lat, lng, st.position[0], st.position[1]);
      if (d < nearest.distance) {
        nearest = { name: st.name, distance: d };
      }
    });

    return {
      ...attr,
      nearestMRT:
        nearest.name !== "Unknown"
          ? `${nearest.name} (${nearest.distance.toFixed(2)} km)`
          : "",
    };
  });

  attractionsCache = { data: finalEnriched, expiresAt: now + CACHE_TTL_MS };
  return finalEnriched;
}

export async function getAttractions(
  _request: Request,
  response: ExpressResponse,
  next: NextFunction
) {
  try {
    const attractions = await loadAttractions();
    response.json(attractions);
  } catch (error) {
    next(error);
  }
}
