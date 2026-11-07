"use client";

import { useState } from "react";

import { RatingStars } from "@/components/product/rating-stars";
import { Button } from "@/components/ui/button";
import { REVIEWS_PAGE_SIZE } from "@/constants";
import type { ReviewWithAuthor } from "@/types";

interface ReviewListProps {
  reviews: ReviewWithAuthor[];
}

export function ReviewList({ reviews }: ReviewListProps) {
  const [visibleCount, setVisibleCount] = useState(REVIEWS_PAGE_SIZE);

  if (reviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed p-12 text-center">
        <p className="font-medium text-muted-foreground">No reviews yet for this game.</p>
        <p className="mt-1 text-xs text-muted-foreground">Be the first to share your experience!</p>
      </div>
    );
  }

  const displayed = reviews.slice(0, visibleCount);
  const remaining = reviews.length - visibleCount;

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4">
        {displayed.map((review) => (
          <div key={review.id} className="flex flex-col gap-2 rounded-xl border bg-card p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">{review.authorName}</span>
              <span className="text-xs text-muted-foreground tabular-nums">
                {new Date(review.createdAt).toLocaleDateString("vi-VN")}
              </span>
            </div>
            <RatingStars rating={review.rating} reviewCount={1} />
            {review.body && <p className="mt-1 text-sm text-muted-foreground">{review.body}</p>}
          </div>
        ))}
      </div>

      {remaining > 0 && (
        <Button
          variant="outline"
          onClick={() => setVisibleCount((count) => count + REVIEWS_PAGE_SIZE)}
          className="mt-2 min-h-11 self-center px-8"
        >
          Show more reviews ({remaining} remaining)
        </Button>
      )}
    </div>
  );
}
