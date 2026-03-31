export interface Landmark {
  id: number;           // OBJECTID_1
  title: string;        // PAGETITLE
  address: string;      // ADDRESS (fallback "Singapore")
  overview: string;     // OVERVIEW
  imageUrl: string | null;
  lat: number;          // geometry.coordinates[1]
  lng: number;          // geometry.coordinates[0]
  categories: string[]; // via getCategories()
  rating: number;       // via getStaticRating()
}

export interface Taxi {
  lat: number;
  lang: number;
}