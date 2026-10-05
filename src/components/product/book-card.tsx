import Image from "next/image";
import Link from "next/link";
import { CakeIcon, ClockIcon, UsersIcon } from "lucide-react";

import {
  BookCardBadge,
  type CardFlags,
} from "@/components/product/book-card-badges";
import { CartActions } from "@/components/product/cart-actions";
import { RatingStars } from "@/components/product/rating-stars";
import { categoryLabel } from "@/constants/game-categories";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Game } from "@/types/game";

function isDiscounted(game: Game): boolean {
  return game.compareAtPrice !== null && game.compareAtPrice > game.price;
}

export function BookCard({
  game,
  flags = {},
}: {
  game: Game;
  flags?: CardFlags;
}) {
  const discounted = isDiscounted(game);
  const outOfStock = game.stock === 0;
  const genre = categoryLabel(game.categories[0]);

  return (
    <article className="flex h-full flex-col gap-1.5 sm:gap-2">
      {}
      <div className="relative aspect-4/5 w-full overflow-hidden rounded-xl border border-border bg-muted sm:aspect-3/4">
        <Link
          href={`/product/${game.slug}`}
          className={cn(
            "absolute inset-0 block",

            outOfStock && "opacity-60 saturate-50",
          )}
        >
          {}
          <Image
            src={game.imageUrl}
            alt={game.name}
            fill

            sizes="(min-width: 1280px) 296px, (min-width: 1024px) 31vw, (min-width: 640px) 46vw, 80vw"
            className="object-cover"
          />
        </Link>

        <div className="pointer-events-none absolute top-2 left-2">
          <BookCardBadge game={game} flags={flags} discounted={discounted} />
        </div>
      </div>

      {}
      <Link
        href={`/product/${game.slug}`}
        title={game.name}
        className="rounded-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
      >
        <h3 className="line-clamp-2 text-sm leading-snug font-semibold">
          {game.name}
        </h3>
      </Link>

      {}
      <p className="truncate text-xs text-muted-foreground">{game.publisher}</p>

      {}
      <RatingStars game={game} />

      {}
      <ul className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
        <li className="flex items-center gap-1">
          <UsersIcon aria-hidden="true" className="size-3.5 shrink-0" />
          <span className="tabular-nums">
            {game.playersMin}–{game.playersMax}
          </span>
          <span className="sr-only">players</span>
        </li>
        <li className="flex items-center gap-1">
          <ClockIcon aria-hidden="true" className="size-3.5 shrink-0" />
          <span className="tabular-nums">{game.playTimeMin} min</span>
        </li>
        <li className="flex items-center gap-1">
          <CakeIcon aria-hidden="true" className="size-3.5 shrink-0" />
          <span className="tabular-nums">{game.ageMin}+</span>
          <span className="sr-only">years and up</span>
        </li>
      </ul>

      {}
      {genre && (
        <div>
          <span className="inline-flex rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
            {genre}
          </span>
        </div>
      )}

      {}
      <div className="mt-auto flex flex-wrap items-baseline gap-x-2 gap-y-0.5 pt-1">
        <span
          className={cn(
            "text-base font-semibold tabular-nums sm:text-lg",
            discounted && "text-sale-price",
          )}
        >
          {formatPrice(game.price)}
        </span>
        {discounted && game.compareAtPrice !== null && (
          <span className="text-xs text-muted-foreground tabular-nums line-through">
            {formatPrice(game.compareAtPrice)}
          </span>
        )}
      </div>

      {}
      <CartActions available={!outOfStock} />
    </article>
  );
}
