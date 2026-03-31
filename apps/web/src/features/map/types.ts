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
