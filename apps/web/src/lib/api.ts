const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

// This is what fixed your TS error
export async function getMRTStations() {
  const response = await fetch(`${BASE_URL}/api/mrt`);
  if (!response.ok) return []; // Fallback so the map doesn't crash
  return response.json();
}

export async function getAttractions() {
  const response = await fetch(`${BASE_URL}/api/attractions`);
  if (!response.ok) throw new Error("Failed to fetch");
  return response.json();
}
