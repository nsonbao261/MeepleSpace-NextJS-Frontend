import type { Expansion } from "./expansion";
import type { Product } from "./product";
import type { ReviewSummary, ReviewWithAuthor } from "./review";

/** Everything the product detail page renders, fetched in one cached read. */
export interface ProductDetail {
  product: Product;
  expansions: Expansion[];
  related: Product[];
  reviews: ReviewWithAuthor[];
  summary: ReviewSummary;
}
