// apps/api/src/controllers/attractionController.ts
import { Request, Response, NextFunction } from "express";

export const getAttractions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1. Fetch from data.gov.sg (using the poll-download logic we discussed)
    const datasetId = "d_0f2f47515425404e6c9d2a040dd87354";
    const pollUrl = `https://api-open.data.gov.sg/v1/public/api/datasets/${datasetId}/poll-download`;

    const pollRes = await fetch(pollUrl);
    const pollJson = await pollRes.json();
    const dataRes = await fetch(pollJson.data.url);
    const geoJson = await dataRes.json();

    // 2. Enhance the first 10-15 items with Pexels images (to stay within rate limits)
    const enhancedFeatures = await Promise.all(
      geoJson.features.map(async (feature: any) => {
        const name = feature["properties"]["PAGETITLE"];

        const pexelsRes = await fetch(
          `https://api.pexels.com/v1/search?query=${encodeURIComponent(
            name + " Singapore"
          )}&per_page=1`,
          { headers: { Authorization: process.env.PEXELS_API_KEY || "" } }
        );

        const pexelsData = await pexelsRes.json();

        return {
          ...feature,
          // Add a new 'imageUrl' property to the object
          imageUrl: pexelsData.photos?.[0]?.src?.large || null,
        };
      })
    );

    res.json(enhancedFeatures);
  } catch (error) {
    next(error);
  }
};
