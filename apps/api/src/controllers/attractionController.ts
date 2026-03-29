import type {
  NextFunction,
  Request,
  Response as ExpressResponse,
} from "express";

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

type PollDownloadResponse = {
  data?: {
    url?: string;
  };
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

let attractionsCache:
  | {
      expiresAt: number;
      data: Array<AttractionFeature & { imageUrl: string | null }>;
    }
  | null = null;

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

async function safeJsonParse<T>(
  response: globalThis.Response,
  context: string,
): Promise<T> {
  try {
    return (await response.json()) as T;
  } catch {
    throw new Error(`${context} returned invalid JSON`);
  }
}

async function fetchDatasetDownloadUrl() {
  const pollUrl = `https://api-open.data.gov.sg/v1/public/api/datasets/${DATASET_ID}/poll-download`;
  const pollResponse = await fetch(pollUrl);

  if (!pollResponse.ok) {
    throw new Error(`Data.gov poll-download failed with HTTP ${pollResponse.status}`);
  }

  const pollJson = await safeJsonParse<PollDownloadResponse>(
    pollResponse,
    "Data.gov poll-download",
  );
  const downloadUrl = pollJson.data?.url;

  if (!isNonEmptyString(downloadUrl)) {
    throw new Error("Data.gov poll-download did not include a usable download URL");
  }

  return downloadUrl;
}

async function fetchBaseAttractions() {
  const downloadUrl = await fetchDatasetDownloadUrl();
  const dataResponse = await fetch(downloadUrl);

  if (!dataResponse.ok) {
    throw new Error(`Data.gov attractions download failed with HTTP ${dataResponse.status}`);
  }

  const geoJson = await safeJsonParse<GeoJsonResponse>(dataResponse, "Data.gov attractions");

  if (!Array.isArray(geoJson.features)) {
    throw new Error("Data.gov attractions payload did not include a features array");
  }

  return geoJson.features;
}

async function fetchPexelsImage(title: string, apiKey: string) {
  const pexelsResponse = await fetch(
    `https://api.pexels.com/v1/search?query=${encodeURIComponent(`${title} Singapore`)}&per_page=1`,
    { headers: { Authorization: apiKey } },
  );

  if (!pexelsResponse.ok) {
    throw new Error(`Pexels search failed with HTTP ${pexelsResponse.status}`);
  }

  const pexelsJson = await safeJsonParse<PexelsResponse>(pexelsResponse, "Pexels search");

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
    }),
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

  if (attractionsCache && attractionsCache.expiresAt > now) {
    return attractionsCache.data;
  }

  const features = await fetchBaseAttractions();
  const enrichedFeatures = await enrichAttractionsWithImages(features);

  attractionsCache = {
    data: enrichedFeatures,
    expiresAt: now + CACHE_TTL_MS,
  };

  return enrichedFeatures;
}

export async function getAttractions(
  _request: Request,
  response: ExpressResponse,
  next: NextFunction,
) {
  try {
    const attractions = await loadAttractions();
    response.json(attractions);
  } catch (error) {
    next(error);
  }
}
