export function getCategories(item: any): string[] {
  const title = (item.properties.PAGETITLE || "").toLowerCase();
  const overview = (item.properties.OVERVIEW || "").toLowerCase();
  const text = `${title} ${overview}`;

  const categories: string[] = [];

  // 1. Arts & Museum
  if (
    text.includes("museum") ||
    text.includes("gallery") ||
    text.includes("arts")
  ) {
    categories.push("Arts & Museum");
  }
  // 2. Culture & Religion
  if (
    text.includes("mosque") ||
    text.includes("temple") ||
    text.includes("church") ||
    text.includes("worship") ||
    text.includes("historical")
  ) {
    categories.push("Culture & Heritage");
  }
  // 3. Nature & Parks
  if (
    text.includes("park") ||
    text.includes("nature") ||
    text.includes("garden") ||
    text.includes("green")
  ) {
    categories.push("Nature & Parks");
  }
  // 4. Architecture
  if (
    text.includes("architecture") ||
    text.includes("monument") ||
    text.includes("landmark") ||
    text.includes("building")
  ) {
    categories.push("Architecture");
  }
  // 5. Lifestyle & Shopping
  if (
    text.includes("mall") ||
    text.includes("shopping") ||
    text.includes("entertainment") ||
    text.includes("lifestyle")
  ) {
    categories.push("Lifestyle");
  }

  // Fallback if nothing matches
  if (categories.length === 0) categories.push("Landmark");

  // Limit to 3 categories to keep the UI clean
  return categories.slice(0, 3);
}