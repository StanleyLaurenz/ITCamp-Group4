import { NextFunction, Request, Response } from "express";

type Reading = { value: number };

function averageReadings(readings: Reading[]): number {
  if (readings.length === 0) return 0;
  const sum = readings.reduce((acc, r) => acc + r.value, 0);
  return sum / readings.length;
}

export async function getWeather(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const [tempRes, rainRes] = await Promise.all([
      fetch("https://api.data.gov.sg/v1/environment/air-temperature"),
      fetch("https://api.data.gov.sg/v1/environment/rainfall"),
    ]);

    const tempData = (await tempRes.json()) as {
      items: Array<{ readings: Reading[] }>;
    };
    const rainData = (await rainRes.json()) as {
      items: Array<{ readings: Reading[] }>;
    };

    const tempReadings = tempData.items[0].readings;
    const rainReadings = rainData.items[0].readings;

    const avgTemp = averageReadings(tempReadings);
    const avgRain = averageReadings(rainReadings);

    const condition = avgRain > 0 ? "Rainy" : "Clear";
    const icon = avgRain > 0 ? "🌧️" : "☀️";

    res.json({
      temp: Number(avgTemp.toFixed(1)),
      rainfall: Number(avgRain.toFixed(1)),
      condition,
      icon,
      location: "Singapore",
    });
  } catch (error) {
    next(error);
  }
}
