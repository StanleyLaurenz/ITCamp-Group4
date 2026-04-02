export interface Landmark {
  id: number;
  title: string;
  address: string;
  overview: string;
  imageUrl: string | null;
  lat: number;
  lng: number;
  categories: string[];
  rating: number;
  nearestMRT?: string; // Add this line
}

export interface Taxi {
  lat: number;
  lng: number;
}

export type WeatherStation = {
  lat: number;
  lng: number;
  value: number;
};

/** MRT API payload item used on the map layer. */
export type MrtStationMarker = {
  name: string;
  position: [number, number];
  lines: string[];
};
