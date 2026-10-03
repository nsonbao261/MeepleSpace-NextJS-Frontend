import { Badge } from "@/components/ui/badge";

import type { Game } from "@/types/game";

const LOW_STOCK_MAX = 5;

export type CardFlags = {
  isBestSeller?: boolean;
  isNew?: boolean;
};

type ResolvedBadge = {
  label: string;
  className?: string;
  variant?: "default" | "secondary" | "destructive";
};

/**
 * Discount percentage, rounded. Mirrors the `discountPercent` helper in
 * `queries.ts`; if the two ever disagree the rail ordering stops matching the
 * badge text, so they are worth keeping in step.
 */
function discountPercent(game: Game): number {
  if (game.compareAtPrice === null) {
    return 0;
  }

  return Math.round(
    ((game.compareAtPrice - game.price) / game.compareAtPrice) * 100,
  );
}

/**
 * The five-level precedence from spec 5.5, resolved to at most one badge.
 *
 * The caller passes `discounted` rather than this module recomputing it, so the
 * badge and the price block in `book-card.tsx` cannot disagree about whether a
 * game is on sale. A second badge slot was rejected in the spec: two colours on
 * 60 cards dilutes both signals.
 *
 * Sale and low-stock colour is applied through `className` at the call site, not
 * by extending `badgeVariants` — `badge.tsx` is vendored shadcn code.
 */
function resolveBadge(
  game: Game,
  flags: CardFlags,
  discounted: boolean,
): ResolvedBadge | null {
  if (game.stock === 0) {
    return { label: "Out of stock", variant: "destructive" };
  }

  if (game.stock <= LOW_STOCK_MAX) {
    return { label: "Low stock", className: "bg-warning/10 text-warning" };
  }

  if (discounted) {
    return {
      label: `On Sale -${discountPercent(game)}%`,
      className: "bg-sale text-sale-foreground",
    };
  }

  if (flags.isBestSeller) {
    return { label: "Best Seller", variant: "default" };
  }

  if (flags.isNew) {
    return { label: "New", variant: "secondary" };
  }

  return null;
}

export function BookCardBadge({
  game,
  flags,
  discounted,
}: {
  game: Game;
  flags: CardFlags;
  discounted: boolean;
}) {
  const badge = resolveBadge(game, flags, discounted);

  if (badge === null) {
    return null;
  }

  return (
    <Badge variant={badge.variant} className={badge.className}>
      {badge.label}
    </Badge>
  );
}
