export interface Expansion {
  id: string;
  slug: string;
  name: string;
  blurb: string;
  price: number;
  originalPrice?: number;
  stock: number;
  image: string;
  imageAlt: string;
  /** Id of the base game this expansion belongs to. */
  baseProductId: string;
}
