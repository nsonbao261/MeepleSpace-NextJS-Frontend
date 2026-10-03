import { StarIcon } from "lucide-react";

import { formatNumber } from "@/lib/format";
import type { Game } from "@/types/game";

const STAR_COUNT = 5;
const STAR_SIZE = "size-3.5";

/**
 * Five identical stars, drawn twice by the caller: once in the empty colour as a
 * static background, once in the rating colour inside a clipping wrapper. Each
 * star is `shrink-0` because the clipping wrapper is width-constrained and flex
 * items would otherwise compress instead of being cropped.
 */
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

/**
 * Fractional star row, the numeric value, and the review count. Server component
 * — no state, no effects, and the clip is a plain width so nothing here needs the
 * client.
 *
 * Accessibility: the stars are decorative and `aria-hidden`, and the visible
 * number carries `sr-only` "out of 5", so the row announces as "4.2 out of 5".
 * This is the `aria-hidden` + text-alternative branch of spec 11 rather than
 * `role="img"` + `aria-label` on the row: labelling the row instead would
 * duplicate the value, because the numeric value is visible text and is not
 * hidden. The count is parenthesised and follows the same rule — visible digits,
 * `sr-only` "reviews" appended, so it is never announced as a bare number.
 */
export function RatingStars({ game }: { game: Game }) {
  // Checked before `ratingValue` is read, per the coherence invariant on
  // `Game.ratingValue`: a zero count always implies a zero value, and showing
  // "0.0" beside "No ratings yet" would be a lie about the score.
  if (game.ratingCount === 0) {
    return <p className="text-xs text-muted-foreground">No ratings yet</p>;
  }

  // A dynamic width, not a colour, so this stays inside the 7.2 ban on raw
  // colour values. Tailwind cannot express a per-game percentage.
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

      {/* The count is what makes the score legible as evidence: a 4.2 from two
          reviews and a 4.2 from four thousand are different claims. Parenthesised
          and muted so it reads as a qualifier on the score rather than competing
          with it. `truncate` guards the 280px floor. */}
      <span className="truncate text-xs text-muted-foreground tabular-nums">
        ({formatNumber(game.ratingCount)}
        <span className="sr-only"> reviews</span>)
      </span>
    </p>
  );
}
