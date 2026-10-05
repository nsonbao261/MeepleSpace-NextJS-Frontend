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

function discountPercent(game: Game): number {
  if (game.compareAtPrice === null) {
    return 0;
  }

  return Math.round(
    ((game.compareAtPrice - game.price) / game.compareAtPrice) * 100,
  );
}

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
