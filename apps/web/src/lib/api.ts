interface HealthResponse {
  status: string;
}

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

function getApiBaseUrl(): string {
  const baseUrl = "http://localhost:3001"; // Ensure no trailing slash
  return baseUrl;
}

export async function getMRTStations() {
  const response = await fetch(`${BASE_URL}/api/mrt`);
  if (!response.ok) return []; // Fallback so the map doesn't crash
  return response.json();
}

export async function getHealth(): Promise<HealthResponse> {
  const response = await fetch(`${getApiBaseUrl()}/api/health`);

  if (!response.ok) {
    throw new Error(`Backend returned HTTP ${response.status}`);
  }

  return response.json() as Promise<HealthResponse>;
}

export async function getAttractions() {
  // Ensure the path passed here starts with a slash
  const response = await fetch(`${getApiBaseUrl()}/api/attractions`);

  if (!response.ok) {
    throw new Error(`Failed to load attractions: ${response.status}`);
  }

  return response.json();
}

export async function getWeather() {
  const response = await fetch(`${getApiBaseUrl()}/api/weather`);

  if (!response.ok) {
    throw new Error(`Failed to load weather data: ${response.status}`);
  }

  return response.json();
}

