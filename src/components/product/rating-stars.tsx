import { StarIcon } from "lucide-react";

import { cn } from "cn";

interface RatingStarsProps {
  rating: number;
  reviewCount: number;
  className?: string;
}

const STARS = Array.from({ length: 5 }, (_, index) => index);

/** Decorative star row sized from the rating; the count lives in sr-only text. */
export function RatingStars({ rating, reviewCount, className }: RatingStarsProps) {
  if (reviewCount === 0) {
    return <span className={cn("text-xs text-muted-foreground", className)}>No reviews yet</span>;
  }

  const fillPercent = Math.min(100, Math.max(0, (rating / 5) * 100));

  return (
    <span className={cn("flex items-center gap-1", className)}>
      <span aria-hidden="true" className="relative inline-flex">
        <span className="flex gap-0.5 text-muted-foreground/30">
          {STARS.map((index) => (
            <StarIcon key={index} className="size-3.5 fill-current" />
          ))}
        </span>
        <span
          className="absolute inset-y-0 left-0 flex gap-0.5 overflow-hidden text-amber-500"
          style={{ width: `${fillPercent}%` }}
        >
          {STARS.map((index) => (
            <StarIcon key={index} className="size-3.5 shrink-0 fill-current" />
          ))}
        </span>
      </span>
      <span className="sr-only">
        {rating.toFixed(1)} out of 5, {reviewCount} review{reviewCount === 1 ? "" : "s"}
      </span>
    </span>
  );
}
