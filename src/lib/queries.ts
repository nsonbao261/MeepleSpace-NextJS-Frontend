import "server-only";

import { getMockGameBySlug, mockGames } from "@/data/games";
import type { Game } from "@/types/game";

/**
 * The read layer. It lives outside `src/data/` on purpose: `src/data/` is mock
 * scaffolding that gets deleted when the NestJS backend lands, and this module
 * is the seam that survives. Swapping `mockGames()` for HTTP calls is meant to
 * be the only change needed to go live.
 *
 * The `server-only` guard is a property of the current implementation, not of
 * this module: it is here because the faker source cannot leave the server. The
 * day client-interactive reads arrive, that guard has to come off.
 */
const RAIL_SIZE = 8;
const HERO_COVER_COUNT = 5;
const BEST_SELLER_SHARE = 0.1;

function activeGames(): Game[] {
  return mockGames().filter((game) => game.status === "active");
}

function discountPercent(game: Game): number {
  if (game.compareAtPrice === null || game.compareAtPrice <= game.price) {
    return 0;
  }

  return ((game.compareAtPrice - game.price) / game.compareAtPrice) * 100;
}

/**
 * Rail selectors read the fixed-seed mock and never mutate it. `filter` and
 * `toSorted` allocate, so the module-level GAMES array stays untouched and the
 * dataset hash is stable across calls. Do not swap these for `sort`.
 */
export function getNewArrivals(): Game[] {
  return activeGames()
    .toSorted((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, RAIL_SIZE);
}

export function getBestSellers(): Game[] {
  return activeGames()
    .toSorted((a, b) => b.soldCount - a.soldCount)
    .slice(0, RAIL_SIZE);
}

export function getOnSale(): Game[] {
  return activeGames()
    .filter((game) => discountPercent(game) > 0)
    .toSorted(
      (a, b) =>
        discountPercent(b) - discountPercent(a) || b.soldCount - a.soldCount,
    )
    .slice(0, RAIL_SIZE);
}

/**
 * Derived from the rail rather than from an independent age threshold. The spec
 * once defined "new" twice — 30 days in the flag rule, 8 most recent in the rail
 * table — and with 60 entries over a 730-day spread only 2 fell inside 30 days,
 * so 6 of 8 rail cards carried no badge. One source of truth, no drift.
 */
export function getNewIds(): Set<string> {
  return new Set(getNewArrivals().map((game) => game.id));
}

/**
 * Top decile by units sold, deliberately decoupled from the eight-item
 * `getBestSellers` rail so the badge set and the rail cannot drift into lockstep.
 */
export function getBestSellerIds(): Set<string> {
  const active = activeGames();
  const size = Math.max(1, Math.ceil(active.length * BEST_SELLER_SHARE));

  return new Set(
    active
      .toSorted((a, b) => b.soldCount - a.soldCount)
      .slice(0, size)
      .map((game) => game.id),
  );
}

export function getMerchandisingFlags(): {
  newIds: Set<string>;
  bestSellerIds: Set<string>;
} {
  return { newIds: getNewIds(), bestSellerIds: getBestSellerIds() };
}

/**
 * Evenly strided sample of the active set: a deterministic spread that avoids
 * the hero fan duplicating the Best Sellers rail, which is also soldCount-led.
 */
export function getHeroCovers(): Game[] {
  const active = activeGames();
  const stride = Math.max(1, Math.floor(active.length / HERO_COVER_COUNT));
  const covers: Game[] = [];

  for (
    let index = 0;
    index < active.length && covers.length < HERO_COVER_COUNT;
    index += stride
  ) {
    covers.push(active[index]);
  }

  return covers;
}

export function getGameBySlug(slug: string): Game | undefined {
  return getMockGameBySlug(slug);
}
