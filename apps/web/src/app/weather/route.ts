import { NextResponse } from "next/server";

function getAverage(readings: { value: number }[]): number {
  if (!readings || !readings.length) return 0;
  const sum = readings.reduce((acc, r) => acc + r.value, 0);
  return Math.round(sum / readings.length);
}

export async function GET() {
  try {
    const BASE = "https://api-open.data.gov.sg/v2/real-time/api";

    // Fetching all data points in parallel
    const [tempRes, humidityRes, rainfallRes, windSpeedRes, windDirRes] =
      await Promise.all([
        fetch(`${BASE}/air-temperature`),
        fetch(`${BASE}/relative-humidity`),
        fetch(`${BASE}/rainfall`),
        fetch(`${BASE}/wind-speed`),
        fetch(`${BASE}/wind-direction`),
      ]);

    const [tempData, humidityData, rainfallData, windSpeedData, windDirData] =
      await Promise.all([
        tempRes.json(),
        humidityRes.json(),
        rainfallRes.json(),
        windSpeedRes.json(),
        windDirRes.json(),
      ]);

    const temp = getAverage(tempData.data?.readings?.[0]?.data ?? []);
    const humidity = getAverage(humidityData.data?.readings?.[0]?.data ?? []);
    const rainfall = getAverage(rainfallData.data?.readings?.[0]?.data ?? []);
    const windSpeed = getAverage(windSpeedData.data?.readings?.[0]?.data ?? []);
    const windDir = getAverage(windDirData.data?.readings?.[0]?.data ?? []);

    return NextResponse.json({
      temp,
      humidity,
      rainfall,
      windSpeed,
      windDir,
      condition: rainfall > 0 ? "Rainy" : humidity > 80 ? "Cloudy" : "Sunny",
      icon: rainfall > 0 ? "🌧️" : humidity > 80 ? "☁️" : "☀️",
      location: "Singapore",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch weather" },
      { status: 500 }
    );
  }
}
