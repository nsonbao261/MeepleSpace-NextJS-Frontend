import "server-only";

import { getMockGameBySlug, mockGames } from "@/data/games";
import type { Game } from "@/types/game";

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

export function getNewIds(): Set<string> {
  return new Set(getNewArrivals().map((game) => game.id));
}

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
