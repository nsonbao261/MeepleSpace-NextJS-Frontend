export interface Product {
  id: string;
  slug: string;
  name: string;
  blurb?: string;
  description: string;
  price: number;
  originalPrice?: number;
  /** Derived from the seeded reviews when the mock array is built. */
  rating: number;
  /** Derived from the seeded reviews when the mock array is built. */
  reviewCount: number;
  image: string;
  imageAlt: string;
  stock: number;
  salesCount: number;
  /** ISO 8601 string so it serializes safely through `use cache`. */
  createdAt: string;
  genre: string;
  publisher: string;
  isNew: boolean;
  isBestSeller: boolean;
  minPlayers: number;
  maxPlayers: number;
  minPlayTimeMinutes: number;
  maxPlayTimeMinutes: number;
  minAge: number;
  designer: string;
}
