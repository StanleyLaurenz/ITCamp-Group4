export async function safeJsonParse<T>(
  response: globalThis.Response,
  context: string
): Promise<T> {
  try {
    return (await response.json()) as T;
  } catch {
    throw new Error(`${context} returned invalid JSON`);
  }
}
