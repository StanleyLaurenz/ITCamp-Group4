// apps/web/src/app/weather/route.ts
import { NextResponse } from "next/server";

function getAverage(readings: any[]): number {
  if (!readings || !readings.length) return 0;
  const valid = readings.filter(
    (r) => r.value !== undefined && r.value !== null
  );
  if (valid.length === 0) return 0;
  const sum = valid.reduce((acc, r) => acc + r.value, 0);
  return Math.round(sum / valid.length);
}

export async function GET() {
  try {
    const BASE = "https://api-open.data.gov.sg/v2/real-time/api";
    const fetchOptions = { cache: "no-store" as RequestCache };

    // Fetch all required data points
    const [tempRes, humidityRes, rainfallRes, windSpeedRes, windDirRes] =
      await Promise.all([
        fetch(`${BASE}/air-temperature`, fetchOptions),
        fetch(`${BASE}/relative-humidity`, fetchOptions),
        fetch(`${BASE}/rainfall`, fetchOptions),
        fetch(`${BASE}/wind-speed`, fetchOptions),
        fetch(`${BASE}/wind-direction`, fetchOptions),
      ]);

    const [tempData, humidityData, rainfallData, windSpeedData, windDirData] =
      await Promise.all([
        tempRes.json(),
        humidityRes.json(),
        rainfallRes.json(),
        windSpeedRes.json(),
        windDirRes.json(),
      ]);

    // Extracting readings for the Widget
    const rainReadings = rainfallData.data?.readings?.[0]?.data ?? [];
    const humidityAvg = getAverage(
      humidityData.data?.readings?.[0]?.data ?? []
    );
    const rainfallAvg = getAverage(rainReadings);

    return NextResponse.json({
      // 1. Data for the Weather Widget
      temp: getAverage(tempData.data?.readings?.[0]?.data ?? []) || 28,
      humidity: humidityAvg || 70,
      rainfall: rainfallAvg,
      windSpeed: getAverage(windSpeedData.data?.readings?.[0]?.data ?? []),
      windDir: getAverage(windDirData.data?.readings?.[0]?.data ?? []),
      condition:
        rainfallAvg > 0 ? "Rainy" : humidityAvg > 80 ? "Cloudy" : "Sunny",
      icon: rainfallAvg > 0 ? "🌧️" : humidityAvg > 80 ? "☁️" : "☀️",
      location: "Singapore",

      // 2. Data for the Heatmap (Crucial for MapInner)
      readings: rainReadings, // Individual station rainfall values
      metadata: rainfallData.data?.stations ?? [], // Station lat/lng coordinates
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Weather fetch failed" },
      { status: 500 }
    );
  }
}
