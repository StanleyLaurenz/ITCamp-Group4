/** Full palette for station markers and line chips on the map. */
export const MRT_LINE_COLORS: Record<string, string> = {
  "NORTH-SOUTH LINE": "#D42E12",
  "EAST-WEST LINE": "#009543",
  "NORTH-EAST LINE": "#8F4199",
  "CIRCLE LINE": "#FFA400",
  "DOWNTOWN LINE": "#005BA4",
  "THOMSON-EAST COAST LINE": "#9D5B25",
  "BUKIT PANJANG LRT": "#748477",
  "SENGKANG LRT": "#748477",
  "PUNGGOL LRT": "#748477",
};

/** Lines shown in the map page filter bar (subset of the network). */
export const MRT_FILTER_LINE_ORDER = [
  "NORTH-SOUTH LINE",
  "EAST-WEST LINE",
  "NORTH-EAST LINE",
  "CIRCLE LINE",
  "DOWNTOWN LINE",
  "THOMSON-EAST COAST LINE",
] as const;
