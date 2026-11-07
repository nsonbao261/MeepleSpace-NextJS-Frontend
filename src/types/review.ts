export type RatingValue = 1 | 2 | 3 | 4 | 5;

export interface Review {
  id: string;
  productId: string;
  authorId: string;
  rating: RatingValue;
  body?: string;
  /** ISO 8601 string so it serializes safely through `use cache`. */
  createdAt: string;
}

export interface ReviewWithAuthor extends Review {
  authorName: string;
}

export interface ReviewSummary {
  /** Average rounded to one decimal; 0 when there are no reviews. */
  average: number;
  count: number;
  distribution: Record<RatingValue, number>;
}
