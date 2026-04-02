import type { MrtStationMarker } from "@/features/map/types";
import type { AttractionRecord } from "./attractionData";

interface HealthResponse {
  status: string;
}

const DEFAULT_API_BASE = "http://localhost:3001";

export function getApiBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  if (raw) {
    return raw.replace(/\/$/, "");
  }
  return DEFAULT_API_BASE;
}

async function apiJson<T>(path: string, errorMessage: string): Promise<T> {
  const response = await fetch(`${getApiBaseUrl()}${path}`);

  if (!response.ok) {
    throw new Error(`${errorMessage}: HTTP ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function getMRTStations(): Promise<MrtStationMarker[]> {
  try {
    return await apiJson<MrtStationMarker[]>("/api/mrt", "MRT fetch failed");
  } catch (e) {
    console.error(e);
    return [];
  }
}

export async function getHealth(): Promise<HealthResponse> {
  return apiJson<HealthResponse>("/api/health", "Backend health check failed");
}

export async function getAttractions(): Promise<AttractionRecord[]> {
  return apiJson<AttractionRecord[]>(
    "/api/attractions",
    "Failed to load attractions"
  );
}

export async function getWeather() {
  return apiJson<Record<string, unknown>>(
    "/api/weather",
    "Failed to load weather data"
  );
}

export async function getTaxis() {
  const response = await fetch(`${getApiBaseUrl()}/api/taxi`);

  if (!response.ok) {
    throw new Error(`Failed to get taxi coordinates: ${response.status}`);
  }

  const data = await response.json()
  
  return data.coords;
}