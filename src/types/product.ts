export interface Product {
  id: string;
  slug: string;
  name: string;
  blurb?: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  imageAlt: string;
  stock: number;
  salesCount: number;
  /** ISO 8601 string so it serializes safely through `use cache`. */
  createdAt: string;
  kind: "base" | "expansion";
  genre: string;
  publisher: string;
  isNew: boolean;
  isBestSeller: boolean;
}
