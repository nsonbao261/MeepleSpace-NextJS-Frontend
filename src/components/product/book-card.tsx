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

/**
 * Single source of truth for "is this game discounted", shared with the badge
 * resolver. `compareAtPrice` being merely present is not enough — EC-5 requires
 * it to be strictly greater than the current price, otherwise a game that went
 * up in price would render a strikethrough and a sale badge.
 */
function isDiscounted(game: Game): boolean {
  return game.compareAtPrice !== null && game.compareAtPrice > game.price;
}

/**
 * The card used by all three rails. Server component: the cover, the copy and
 * the price are all rendered on the server, so the catalog is readable in the
 * HTML with no JavaScript. The only client leaf is `CartActions`.
 *
 * The card is not one big link — the cover and the title link to the product
 * page independently, so the two action buttons remain separately focusable
 * (spec 5.5, spec 11).
 */
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
      {/* 1. Cover, 2. badge overlay. */}
      <div className="relative aspect-4/5 w-full overflow-hidden rounded-xl border border-border bg-muted sm:aspect-3/4">
        <Link
          href={`/product/${game.slug}`}
          className={cn(
            "absolute inset-0 block",
            // Out of stock reads as unavailable without hiding the artwork, so
            // the title is still legible and the card is still identifiable.
            outOfStock && "opacity-60 saturate-50",
          )}
        >
          {/* The cover link's accessible name is the image alt, which is the
              product title — not "View details". */}
          <Image
            src={game.imageUrl}
            alt={game.name}
            fill
            // Derived from the rail's own `CarouselItem` bases, not guessed.
            // Measured: 85% basis on a 375px screen renders the cover 291px
            // wide = 78vw; 46% at 640px = 272px = 43vw; 31% at 1024px = 303px =
            // 30vw; 24% of the 1232px track once the container caps at 1280px =
            // 296px. Every figure below rounds up slightly, which costs a little
            // image weight but can never serve an undersized candidate and blur
            // the cover.
            sizes="(min-width: 1280px) 296px, (min-width: 1024px) 31vw, (min-width: 640px) 46vw, 80vw"
            className="object-cover"
          />
        </Link>

        <div className="pointer-events-none absolute top-2 left-2">
          <BookCardBadge game={game} flags={flags} discounted={discounted} />
        </div>
      </div>

      {/* 3. Title. Two-line clamp with the full title in `title` so the
          truncation is recoverable on hover (EC-8). */}
      <Link
        href={`/product/${game.slug}`}
        title={game.name}
        className="rounded-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
      >
        <h3 className="line-clamp-2 text-sm leading-snug font-semibold">
          {game.name}
        </h3>
      </Link>

      {/* 4. Publisher, single line, truncated (EC-9). */}
      <p className="truncate text-xs text-muted-foreground">{game.publisher}</p>

      {/* 5. Rating: stars, score, and review count. Still one row, so the
          count did not become a tenth face element. */}
      <RatingStars game={game} />

      {/* 6. Meta row. Icons are decorative; the values are real text. A list,
          not a description list: there is no term being defined, so `<dd>`
          without a `<dt>` would be invalid. */}
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

      {/* 7. Genre pill, first category only. Never rendered empty (EC-11). */}
      {genre && (
        <div>
          <span className="inline-flex rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
            {genre}
          </span>
        </div>
      )}

      {/* 8. Price block. `text-sale-price` is reserved for the discounted
          figure and is never applied to a full-price one. The row wraps rather
          than clipping at 280px (EC-10). One step down on mobile only, which is
          most of the height the shorter card saves. */}
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

      {/* 9. Actions. */}
      <CartActions available={!outOfStock} />
    </article>
  );
}
