import { NextResponse } from 'next/server';

// Helper to get the average reading across all stations
function getAverage(readings: { value: number }[]): number {
  if (!readings.length) return 0;
  const sum = readings.reduce((acc, r) => acc + r.value, 0);
  return Math.round(sum / readings.length);
}

// Derive a weather condition from the data
function getCondition(rainfall: number, humidity: number): string {
  if (rainfall > 1) return 'Rainy';
  if (rainfall > 0) return 'Light Rain';
  if (humidity > 85) return 'Cloudy';
  if (humidity > 70) return 'Partly Cloudy';
  return 'Sunny';
}

// Pick an emoji icon based on condition
function getIcon(condition: string): string {
  if (condition.includes('Rain')) return '🌧️';
  if (condition === 'Cloudy') return '☁️';
  if (condition === 'Partly Cloudy') return '⛅';
  return '☀️';
}

export async function GET() {
  try {
    const BASE = 'https://api-open.data.gov.sg/v2/real-time/api';

    const [tempRes, humidityRes, rainfallRes] = await Promise.all([
      fetch(`${BASE}/air-temperature`),
      fetch(`${BASE}/relative-humidity`),
      fetch(`${BASE}/rainfall`),
    ]);

    const [tempData, humidityData, rainfallData] = await Promise.all([
      tempRes.json(),
      humidityRes.json(),
      rainfallRes.json(),
    ]);

    const temperature = getAverage(
      tempData.data?.readings?.[0]?.data ?? []
    );
    const humidity = getAverage(
      humidityData.data?.readings?.[0]?.data ?? []
    );
    const rainfall = getAverage(
      rainfallData.data?.readings?.[0]?.data ?? []
    );

    const condition = getCondition(rainfall, humidity);
    const icon = getIcon(condition);

    return NextResponse.json({
      temp: temperature,
      humidity,
      rainfall,
      condition,
      icon,
      location: 'Singapore',
    });

  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch weather' }, { status: 500 });
  }
}