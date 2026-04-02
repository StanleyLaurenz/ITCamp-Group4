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

    const [tempRes, humidityRes, windSpeedRes, windDirRes] = await Promise.all([
      fetch(`${BASE}/air-temperature`, fetchOptions),
      fetch(`${BASE}/relative-humidity`, fetchOptions),
      fetch(`${BASE}/wind-speed`, fetchOptions),
      fetch(`${BASE}/wind-direction`, fetchOptions),
    ]);

    const [tempData, humidityData, windSpeedData, windDirData] =
      await Promise.all([
        tempRes.json(),
        humidityRes.json(),
        windSpeedRes.json(),
        windDirRes.json(),
      ]);

    const humidityAvg = getAverage(
      humidityData.data?.readings?.[0]?.data ?? []
    );

    return NextResponse.json({
      temp: getAverage(tempData.data?.readings?.[0]?.data ?? []) || 28,
      humidity: humidityAvg || 70,
      windSpeed: getAverage(windSpeedData.data?.readings?.[0]?.data ?? []),
      windDir: getAverage(windDirData.data?.readings?.[0]?.data ?? []),
      condition: humidityAvg > 80 ? "Cloudy" : "Sunny",
      icon: humidityAvg > 80 ? "☁️" : "☀️",
      location: "Singapore",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Weather fetch failed" },
      { status: 500 }
    );
  }
}
