import { ReviewForm } from "@/components/product/review-form";
import { ReviewList } from "@/components/product/review-list";
import { RatingStars } from "@/components/product/rating-stars";
import type { RatingValue, ReviewSummary, ReviewWithAuthor } from "@/types";

interface ReviewsSectionProps {
  productSlug: string;
  summary: ReviewSummary;
  reviews: ReviewWithAuthor[];
}

const DISTRIBUTION_ORDER = [5, 4, 3, 2, 1] as const satisfies readonly RatingValue[];

export function ReviewsSection({ productSlug, summary, reviews }: ReviewsSectionProps) {
  const { average, count, distribution } = summary;

  return (
    <section aria-labelledby="reviews-heading" className="flex flex-col gap-8 border-t pt-12">
      <div className="flex flex-col gap-1">
        <h2 id="reviews-heading" className="font-display text-2xl tracking-tight sm:text-3xl">
          Ratings & Reviews
        </h2>
        <p className="text-sm text-muted-foreground">
          Real feedback from community players and board game enthusiasts.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 rounded-2xl border bg-card p-6 md:grid-cols-12 md:items-center">
        <div className="flex flex-col items-center justify-center border-b pb-6 md:col-span-4 md:border-r md:border-b-0 md:pr-6 md:pb-0">
          <span className="font-display text-5xl font-normal tabular-nums">
            {average.toFixed(1)}
          </span>
          <div className="my-2">
            <RatingStars rating={average} reviewCount={count} />
          </div>
          <span className="text-sm text-muted-foreground">{count} total reviews</span>
        </div>

        <div className="flex flex-col gap-2 md:col-span-8">
          {DISTRIBUTION_ORDER.map((stars) => {
            const starCount = distribution[stars];
            const percentage = count > 0 ? (starCount / count) * 100 : 0;

            return (
              <div key={stars} className="flex items-center gap-3 text-sm">
                <span className="w-12 text-right font-medium text-muted-foreground">
                  {stars} stars
                </span>
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-amber-500 transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-8 text-left text-xs text-muted-foreground tabular-nums">
                  {starCount}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <ReviewForm productSlug={productSlug} />
      <ReviewList reviews={reviews} />
    </section>
  );
}
