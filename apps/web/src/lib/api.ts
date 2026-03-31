export type HealthResponse = {
  ok: boolean;
  status: string;
  timestamp: string;
};

export function getApiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";
}

export async function getHealth(): Promise<HealthResponse> {
  const response = await fetch(`${getApiBaseUrl()}/api/health`);

  if (!response.ok) {
    throw new Error(`Backend returned HTTP ${response.status}`);
  }

  return response.json() as Promise<HealthResponse>;
}

export async function getAttractions() {
  const response = await fetch(`${getApiBaseUrl()}/api/attractions`);

  if (!response.ok) {
    throw new Error(`Failed to load attractions: ${response.status}`);
  }

  return response.json();
}

export async function getTaxis() {
  const response = await fetch(`${getApiBaseUrl()}/api/taxi`);

  if (!response.ok) {
    throw new Error(`Failed to get taxi coordinates: ${response.status}`);
  }
  
  return response.json();
}