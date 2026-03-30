export type HealthResponse = {
  ok: boolean;
  status: string;
  timestamp: string;
};

// In your getApiBaseUrl() function (or wherever it's defined):
function getApiBaseUrl(): string {
  const baseUrl = "http://localhost:3001"; // Ensure no trailing slash
  return baseUrl;
}

export async function getHealth(): Promise<HealthResponse> {
  const response = await fetch(`${getApiBaseUrl()}/api/health`);

  if (!response.ok) {
    throw new Error(`Backend returned HTTP ${response.status}`);
  }

  return response.json() as Promise<HealthResponse>;
}

// In your api.ts file:
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

