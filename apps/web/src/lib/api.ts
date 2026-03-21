export type HealthResponse = {
  ok: boolean
  status: string
  timestamp: string
}

export function getApiBaseUrl() {
  return import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001'
}

export async function getHealth(): Promise<HealthResponse> {
  const response = await fetch(`${getApiBaseUrl()}/api/health`)

  if (!response.ok) {
    throw new Error(`Backend returned HTTP ${response.status}`)
  }

  return response.json() as Promise<HealthResponse>
}
