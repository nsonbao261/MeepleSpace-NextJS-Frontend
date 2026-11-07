import type { Review, ReviewSummary, RatingValue } from "@/types";

const EMPTY_DISTRIBUTION: Record<RatingValue, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

/** Average rounded to one decimal, count and 1..5 distribution. */
export function summarizeReviews(reviews: Review[]): ReviewSummary {
  const distribution = { ...EMPTY_DISTRIBUTION };
  let total = 0;

  for (const review of reviews) {
    distribution[review.rating] += 1;
    total += review.rating;
  }

  const count = reviews.length;
  const average = count === 0 ? 0 : Math.round((total / count) * 10) / 10;

  return { average, count, distribution };
}
