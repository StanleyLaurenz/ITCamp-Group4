import { safeJsonParse } from "../utils/json.js";

type PollDownloadBody = {
  code?: number;
  data?: { url?: string };
  errMsg?: string;
};

/**
 * Resolves a one-time download URL for a dataset on api-open.data.gov.sg.
 */
export async function fetchOpenDatasetDownloadUrl(
  datasetId: string,
  context: string
): Promise<string> {
  const pollUrl = `https://api-open.data.gov.sg/v1/public/api/datasets/${datasetId}/poll-download`;
  const response = await fetch(pollUrl);

  if (!response.ok) {
    throw new Error(
      `${context} poll-download failed with HTTP ${response.status}`
    );
  }

  const pollJson = await safeJsonParse<PollDownloadBody>(response, context);

  if (typeof pollJson.code === "number" && pollJson.code !== 0) {
    throw new Error(pollJson.errMsg || `${context} poll-download failed`);
  }

  const downloadUrl = pollJson.data?.url;
  if (typeof downloadUrl !== "string" || downloadUrl.trim().length === 0) {
    throw new Error(`${context} did not include a usable download URL`);
  }

  return downloadUrl;
}
