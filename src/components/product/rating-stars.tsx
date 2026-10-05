import { StarIcon } from "lucide-react";

import { formatNumber } from "@/lib/format";
import type { Game } from "@/types/game";

const STAR_COUNT = 5;
const STAR_SIZE = "size-3.5";

function StarRow() {
  return (
    <>
      {Array.from({ length: STAR_COUNT }, (_, index) => (
        <StarIcon
          key={index}
          aria-hidden="true"
          fill="currentColor"
          className={`${STAR_SIZE} shrink-0`}
        />
      ))}
    </>
  );
}

export function RatingStars({ game }: { game: Game }) {
  if (game.ratingCount === 0) {
    return <p className="text-xs text-muted-foreground">No ratings yet</p>;
  }

  const filledPercent = (game.ratingValue / STAR_COUNT) * 100;

  return (
    <p className="flex items-center gap-1.5">
      <span aria-hidden="true" className="relative inline-flex">
        <span className="inline-flex text-rating-empty">
          <StarRow />
        </span>
        <span
          className="absolute inset-y-0 left-0 inline-flex overflow-hidden text-rating"
          style={{ width: `${filledPercent}%` }}
        >
          <StarRow />
        </span>
      </span>

      <span className="text-xs font-medium tabular-nums">
        {game.ratingValue.toFixed(1)}
        <span className="sr-only"> out of 5</span>
      </span>

      {}
      <span className="truncate text-xs text-muted-foreground tabular-nums">
        ({formatNumber(game.ratingCount)}
        <span className="sr-only"> reviews</span>)
      </span>
    </p>
  );
}
