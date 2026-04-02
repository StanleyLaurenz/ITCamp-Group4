import { Request, Response, NextFunction } from "express";

import { fetchOpenDatasetDownloadUrl } from "../lib/dataGovOpen.js";
import { safeJsonParse } from "../utils/json.js";

type MrtFeature = {
  geometry: {
    coordinates: [number, number];
  };
  properties: {
    STATION_NA: string;
  };
};

export type MrtStation = {
  name: string;
  position: [number, number];
  lines: string[];
};

// --- CONFIG ---
const MRT_EXITS_ID = "d_b39d3a0871985372d7e1637193335da5";
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // Cache for 24 hours (MRT stations don't move)

let mrtCache: {
  expiresAt: number;
  data: MrtStation[];
} | null = null;

const STATION_LINE_MAP: Record<string, string[]> = {
  "JURONG EAST": ["NORTH-SOUTH LINE", "EAST-WEST LINE"],
  "BUKIT BATOK": ["NORTH-SOUTH LINE"],
  "BUKIT GOMBAK": ["NORTH-SOUTH LINE"],
  "CHOA CHU KANG": ["NORTH-SOUTH LINE", "BUKIT PANJANG LRT"],
  "YEW TEE": ["NORTH-SOUTH LINE"],
  KRANJI: ["NORTH-SOUTH LINE"],
  MARSILING: ["NORTH-SOUTH LINE"],
  WOODLANDS: ["NORTH-SOUTH LINE", "THOMSON-EAST COAST LINE"],
  ADMIRALTY: ["NORTH-SOUTH LINE"],
  SEMBAWANG: ["NORTH-SOUTH LINE"],
  CANBERRA: ["NORTH-SOUTH LINE"],
  YISHUN: ["NORTH-SOUTH LINE"],
  KHATIB: ["NORTH-SOUTH LINE"],
  "YIO CHU KANG": ["NORTH-SOUTH LINE"],
  "ANG MO KIO": ["NORTH-SOUTH LINE"],
  BISHAN: ["NORTH-SOUTH LINE", "CIRCLE LINE"],
  BRADDELL: ["NORTH-SOUTH LINE"],
  "TOA PAYOH": ["NORTH-SOUTH LINE"],
  NOVENA: ["NORTH-SOUTH LINE"],
  NEWTON: ["NORTH-SOUTH LINE", "DOWNTOWN LINE"],
  ORCHARD: ["NORTH-SOUTH LINE", "THOMSON-EAST COAST LINE"],
  SOMERSET: ["NORTH-SOUTH LINE"],
  "DHOBY GHAUT": ["NORTH-SOUTH LINE", "NORTH-EAST LINE", "CIRCLE LINE"],
  "CITY HALL": ["NORTH-SOUTH LINE", "EAST-WEST LINE"],
  "RAFFLES PLACE": ["NORTH-SOUTH LINE", "EAST-WEST LINE"],
  "MARINA BAY": ["NORTH-SOUTH LINE", "CIRCLE LINE", "THOMSON-EAST COAST LINE"],
  "MARINA SOUTH PIER": ["NORTH-SOUTH LINE"],
  "PASIR RIS": ["EAST-WEST LINE"],
  TAMPINES: ["EAST-WEST LINE", "DOWNTOWN LINE"],
  SIMEI: ["EAST-WEST LINE"],
  "TANAH MERAH": ["EAST-WEST LINE"],
  BEDOK: ["EAST-WEST LINE"],
  KEMBANGAN: ["EAST-WEST LINE"],
  EUNOS: ["EAST-WEST LINE"],
  "PAYA LEBAR": ["EAST-WEST LINE", "CIRCLE LINE"],
  ALJUNIED: ["EAST-WEST LINE"],
  KALLANG: ["EAST-WEST LINE"],
  LAVENDER: ["EAST-WEST LINE"],
  BUGIS: ["EAST-WEST LINE", "DOWNTOWN LINE"],
  "OUTRAM PARK": [
    "EAST-WEST LINE",
    "NORTH-EAST LINE",
    "THOMSON-EAST COAST LINE",
  ],
  "TIONG BAHRU": ["EAST-WEST LINE"],
  "REDHILL": ["EAST-WEST LINE"],
  "QUEENSTOWN": ["EAST-WEST LINE"],
  "COMMONWEALTH": ["EAST-WEST LINE"],
  "BUONA VISTA": ["EAST-WEST LINE", "CIRCLE LINE"],
  DOVER: ["EAST-WEST LINE"],
  CLEMENTI: ["EAST-WEST LINE"],
  "CHINESE GARDEN": ["EAST-WEST LINE"],
  LAKESIDE: ["EAST-WEST LINE"],
  "BOON LAY": ["EAST-WEST LINE"],
  PIONEER: ["EAST-WEST LINE"],
  "JOO KOON": ["EAST-WEST LINE"],
  "GUL CIRCLE": ["EAST-WEST LINE"],
  "TUAS CRESCENT": ["EAST-WEST LINE"],
  "TUAS WEST ROAD": ["EAST-WEST LINE"],
  "TUAS LINK": ["EAST-WEST LINE"],
  EXPO: ["EAST-WEST LINE", "DOWNTOWN LINE"],
  "CHANGI AIRPORT": ["EAST-WEST LINE"],
  HARBOURFRONT: ["NORTH-EAST LINE", "CIRCLE LINE"],
  CHINATOWN: ["NORTH-EAST LINE", "DOWNTOWN LINE"],
  "CLARKE QUAY": ["NORTH-EAST LINE"],
  "FARRER PARK": ["NORTH-EAST LINE"],
  "BOON KENG": ["NORTH-EAST LINE"],
  "POTONG PASIR": ["NORTH-EAST LINE"],
  WOODLEIGH: ["NORTH-EAST LINE"],
  SERANGOON: ["NORTH-EAST LINE", "CIRCLE LINE"],
  KOVAN: ["NORTH-EAST LINE"],
  HOUGANG: ["NORTH-EAST LINE"],
  SENGKANG: ["NORTH-EAST LINE", "SENGKANG LRT"],
  PUNGGOL: ["NORTH-EAST LINE", "PUNGGOL LRT"],
  "BRAS BASAH": ["CIRCLE LINE"],
  ESPLANADE: ["CIRCLE LINE"],
  PROMENADE: ["CIRCLE LINE", "DOWNTOWN LINE"],
  "NICOLL HIGHWAY": ["CIRCLE LINE"],
  STADIUM: ["CIRCLE LINE"],
  MOUNTBATTEN: ["CIRCLE LINE"],
  DAKOTA: ["CIRCLE LINE"],
  MACPHERSON: ["CIRCLE LINE", "DOWNTOWN LINE"],
  "TAI SENG": ["CIRCLE LINE"],
  BARTLEY: ["CIRCLE LINE"],
  "LORONG CHUAN": ["CIRCLE LINE"],
  MARYMOUNT: ["CIRCLE LINE"],
  CALDECOTT: ["CIRCLE LINE", "THOMSON-EAST COAST LINE"],
  "BOTANIC GARDENS": ["CIRCLE LINE", "DOWNTOWN LINE"],
  "FARRER ROAD": ["CIRCLE LINE"],
  "HOLLAND VILLAGE": ["CIRCLE LINE"],
  "ONE-NORTH": ["CIRCLE LINE"],
  "KENT RIDGE": ["CIRCLE LINE"],
  "HAW PAR VILLA": ["CIRCLE LINE"],
  "PASIR PANJANG": ["CIRCLE LINE"],
  "LABRADOR PARK": ["CIRCLE LINE"],
  "TELOK BLANGAH": ["CIRCLE LINE"],
  BAYFRONT: ["CIRCLE LINE", "DOWNTOWN LINE"],
  "BUKIT PANJANG": ["DOWNTOWN LINE", "BUKIT PANJANG LRT"],
  CASHEW: ["DOWNTOWN LINE"],
  HILLVIEW: ["DOWNTOWN LINE"],
  "BEAUTY WORLD": ["DOWNTOWN LINE"],
  "KING ALBERT PARK": ["DOWNTOWN LINE"],
  "SIXTH AVENUE": ["DOWNTOWN LINE"],
  "TAN KAH KEE": ["DOWNTOWN LINE"],
  STEVENS: ["DOWNTOWN LINE", "THOMSON-EAST COAST LINE"],
  "LITTLE INDIA": ["DOWNTOWN LINE", "NORTH-EAST LINE"],
  ROCHOR: ["DOWNTOWN LINE"],
  BENCKOOLEN: ["DOWNTOWN LINE"],
  "JALAN BESAR": ["DOWNTOWN LINE"],
  BENDEMEER: ["DOWNTOWN LINE"],
  "GEYLANG BAHRU": ["DOWNTOWN LINE"],
  MATTAR: ["DOWNTOWN LINE"],
  UBI: ["DOWNTOWN LINE"],
  "KAKI BUKIT": ["DOWNTOWN LINE"],
  "BEDOK NORTH": ["DOWNTOWN LINE"],
  "BEDOK RESERVOIR": ["DOWNTOWN LINE"],
  "TAMPINES WEST": ["DOWNTOWN LINE"],
  "TAMPINES EAST": ["DOWNTOWN LINE"],
  "UPPER CHANGI": ["DOWNTOWN LINE"],
  "WOODLANDS NORTH": ["THOMSON-EAST COAST LINE"],
  "WOODLANDS SOUTH": ["THOMSON-EAST COAST LINE"],
  SPRINGLEAF: ["THOMSON-EAST COAST LINE"],
  LENTOR: ["THOMSON-EAST COAST LINE"],
  MAYFLOWER: ["THOMSON-EAST COAST LINE"],
  "BRIGHT HILL": ["THOMSON-EAST COAST LINE"],
  "UPPER THOMSON": ["THOMSON-EAST COAST LINE"],
  "MOUNT PLEASANT": ["THOMSON-EAST COAST LINE"],
  NAPIER: ["THOMSON-EAST COAST LINE"],
  "ORCHARD BOULEVARD": ["THOMSON-EAST COAST LINE"],
  HAVELOCK: ["THOMSON-EAST COAST LINE"],
  MAXWELL: ["THOMSON-EAST COAST LINE"],
  "SHENTON WAY": ["THOMSON-EAST COAST LINE"],
  "GARDENS BY THE BAY": ["THOMSON-EAST COAST LINE"],
};

async function fetchBaseMrtData(): Promise<MrtFeature[]> {
  const downloadUrl = await fetchOpenDatasetDownloadUrl(
    MRT_EXITS_ID,
    "Data.gov MRT"
  );
  const response = await fetch(downloadUrl);

  if (!response.ok) throw new Error("Failed to download MRT GeoJSON");

  const geoJson = await safeJsonParse<{ features?: MrtFeature[] }>(
    response,
    "Data.gov MRT GeoJSON"
  );
  return geoJson.features || [];
}

// --- CORE LOGIC (Matching Attraction Style) ---

export async function loadMrtStations(): Promise<MrtStation[]> {
  const now = Date.now();

  // 1. Return Cache if valid
  if (mrtCache && mrtCache.expiresAt > now) {
    return mrtCache.data;
  }

  try {
    // 2. Fetch and Process
    const features = await fetchBaseMrtData();
    const stationMap = new Map<string, MrtStation>();

    features.forEach((f) => {
      const rawName = f.properties.STATION_NA;
      const cleanName = rawName.replace(/ (MRT|LRT) STATION/g, "").trim();

      if (!stationMap.has(cleanName)) {
        stationMap.set(cleanName, {
          name: cleanName,
          // Convert [Lng, Lat] to [Lat, Lng]
          position: [f.geometry.coordinates[1], f.geometry.coordinates[0]],
          lines: STATION_LINE_MAP[cleanName] || ["OTHER"],
        });
      }
    });

    const stations = Array.from(stationMap.values());

    // 3. Save to Cache
    mrtCache = {
      data: stations,
      expiresAt: now + CACHE_TTL_MS,
    };

    return stations;
  } catch (error) {
    console.error("MRT Data load failed:", error);
    // Return old cache if available, otherwise empty array
    return mrtCache?.data || [];
  }
}

// --- EXPORTED CONTROLLER ROUTES ---

export const getMRTData = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const stations = await loadMrtStations();
    res.json(stations);
  } catch (error) {
    next(error);
  }
};
