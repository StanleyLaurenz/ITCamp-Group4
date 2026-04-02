function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";
}

export async function getMRTStations() {
  const response = await fetch(`${getApiBaseUrl()}/api/mrt`);

  if (!response.ok) {
    console.error("MRT Fetch failed with status:", response.status);
    return [];
  }
  return response.json();
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

  const data = await response.json();

  return data.coords;
}
