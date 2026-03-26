import { Request, Response, NextFunction } from "express";

export const getAttractions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const datasetId = "d_0f2f47515425404e6c9d2a040dd87354";
    const url = `https://api-open.data.gov.sg/v1/public/api/datasets/${datasetId}/poll-download`;

    // Request the temporary download link
    const pollResponse = await fetch(url);
    if (!pollResponse.ok) throw new Error("Failed to initiate poll-download");

    const jsonData = await pollResponse.json();
    if (jsonData.code !== 0) throw new Error(jsonData.errMsg || "API Error");

    // Fetch the actual data content
    const fetchUrl = jsonData.data.url;
    const finalResponse = await fetch(fetchUrl);

    if (!finalResponse.ok) throw new Error("Failed to fetch actual dataset");

    const data = await finalResponse.json();

    // Send the result to the frontend
    res.json(data);
  } catch (error) {
    next(error);
  }
};
