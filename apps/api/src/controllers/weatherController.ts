import { NextFunction, Request, Response } from "express";

export async function getWeather(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // fetch temperature
    const tempRes = await fetch('https://api.data.gov.sg/v1/environment/air-temperature');
    const tempData = await tempRes.json();

    // fetch rainfall
    const rainRes = await fetch('https://api.data.gov.sg/v1/environment/rainfall');
    const rainData = await rainRes.json();

    const tempReadings = tempData.items[0].readings;
    const rainReadings = rainData.items[0].readings;

    const avgTemp =
      tempReadings.reduce((sum: number, r: any) => sum + r.value, 0) /
      tempReadings.length;

    const avgRain =
      rainReadings.reduce((sum: number, r: any) => sum + r.value, 0) /
      rainReadings.length;

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