import { accounts, reviews } from "@/data";
import { summarizeReviews } from "@/lib/reviews";
import type { Review, ReviewSummary, ReviewWithAuthor } from "@/types";

const authorNames = new Map(accounts.map((account) => [account.id, account.name]));

function toReviewWithAuthor(review: Review): ReviewWithAuthor {
  return {
    ...review,
    authorName: authorNames.get(review.authorId) ?? "MeepleSpace player",
  };
}

/** Newest first, with the author name attached for display. */
export function getReviewsForProduct(productId: string): ReviewWithAuthor[] {
  return reviews
    .filter((review) => review.productId === productId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map(toReviewWithAuthor);
}

export function getReviewSummary(productId: string): ReviewSummary {
  return summarizeReviews(reviews.filter((review) => review.productId === productId));
}
