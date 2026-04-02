import { NextFunction, Request, Response } from "express";

export const getTaxis = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sgt = new Date(Date.now() + 8 * 3600 * 1000);
    const formattedTime = sgt.toISOString().slice(0, 19);

    const apiURL = `https://api.data.gov.sg/v1/transport/taxi-availability?date_time=${encodeURIComponent(formattedTime)}`;

    const response = await fetch(apiURL);
    const data = (await response.json()) as {
      features: Array<{
        properties: Record<string, unknown>;
        geometry: { coordinates: [number, number][] };
      }>;
    };

    const features = data.features[0];
    const meta = features.properties;
    const taxis = features.geometry.coordinates;

    const coords = taxis.map(([lng, lat]: [number, number]) => ({ lat, lng }));

    res.json({ meta, coords });
  } catch (error) {
    next(error);
  }
};
