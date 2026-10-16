import "server-only";

import {
  AGE_OPTIONS,
  BADGE_OPTIONS,
  PAGE_SIZE,
  PLAYER_BUCKETS,
  PLAY_TIME_BUCKETS,
  RATING_OPTIONS,
} from "@/constants/catalog-filters";
import {
  CATEGORY_LABELS,
  type CategorySlug,
} from "@/constants/game-categories";
import { getMockGameBySlug, mockGames } from "@/data/games";
import type {
  BadgeFilter,
  CatalogFilters,
  CatalogResult,
  CategoryOption,
  FacetCounts,
  MerchandisingFlags,
  PlayTimeBucket,
  PlayerBucket,
  PriceBounds,
  PublisherOption,
  SortDirection,
  SortKey,
} from "@/types/catalog";
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

const nameCollator = new Intl.Collator("en", { sensitivity: "base" });

type FilterKey =
  | "category"
  | "publisher"
  | "price"
  | "rating"
  | "players"
  | "playTime"
  | "age"
  | "badge";

function foldName(value: string): string {
  return value.trim().normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
}

function samePublisher(left: string, right: string): boolean {
  return left.toLowerCase() === right.toLowerCase();
}

function matchesSearch(game: Game, filters: CatalogFilters): boolean {
  return filters.q === "" || foldName(game.name).includes(filters.q);
}

function matchesCategories(game: Game, filters: CatalogFilters): boolean {
  return (
    filters.categories.length === 0 ||
    filters.categories.some((category) => game.categories.includes(category))
  );
}

function matchesPublisher(game: Game, filters: CatalogFilters): boolean {
  return (
    filters.publisher === null ||
    samePublisher(game.publisher, filters.publisher)
  );
}

function matchesPrice(game: Game, filters: CatalogFilters): boolean {
  return (
    (filters.priceMin === null || game.price >= filters.priceMin) &&
    (filters.priceMax === null || game.price <= filters.priceMax)
  );
}

function matchesRating(game: Game, filters: CatalogFilters): boolean {
  return filters.rating === null || game.ratingValue >= filters.rating;
}

function matchesPlayerBucket(game: Game, bucket: PlayerBucket): boolean {
  const range = PLAYER_BUCKETS.find((entry) => entry.value === bucket);

  return range !== undefined
    ? game.playersMax >= range.min && game.playersMin <= range.max
    : false;
}

function matchesPlayers(game: Game, filters: CatalogFilters): boolean {
  return (
    filters.players.length === 0 ||
    filters.players.some((bucket) => matchesPlayerBucket(game, bucket))
  );
}

function matchesPlayTimeBucket(game: Game, bucket: PlayTimeBucket): boolean {
  const range = PLAY_TIME_BUCKETS.find((entry) => entry.value === bucket);

  return range !== undefined
    ? game.playTimeMin >= range.min && game.playTimeMin <= range.max
    : false;
}

function matchesPlayTimes(game: Game, filters: CatalogFilters): boolean {
  return (
    filters.playTimes.length === 0 ||
    filters.playTimes.some((bucket) => matchesPlayTimeBucket(game, bucket))
  );
}

function matchesAge(game: Game, filters: CatalogFilters): boolean {
  return filters.ageMax === null || game.ageMin <= filters.ageMax;
}

function matchesBadge(
  game: Game,
  badge: BadgeFilter,
  flags: MerchandisingFlags,
): boolean {
  switch (badge) {
    case "sale":
      return game.compareAtPrice !== null && game.compareAtPrice > game.price;
    case "new":
      return flags.newIds.has(game.id);
    case "best":
      return flags.bestSellerIds.has(game.id);
    case "in-stock":
      return game.stock > 0;
  }
}

function matchesBadges(
  game: Game,
  filters: CatalogFilters,
  flags: MerchandisingFlags,
): boolean {
  return (
    filters.badges.length === 0 ||
    filters.badges.some((badge) => matchesBadge(game, badge, flags))
  );
}

function passesFilters(
  game: Game,
  filters: CatalogFilters,
  flags: MerchandisingFlags,
  except?: FilterKey,
): boolean {
  if (game.status !== "active") {
    return false;
  }

  if (!matchesSearch(game, filters)) {
    return false;
  }

  if (except !== "category" && !matchesCategories(game, filters)) {
    return false;
  }

  if (except !== "publisher" && !matchesPublisher(game, filters)) {
    return false;
  }

  if (except !== "price" && !matchesPrice(game, filters)) {
    return false;
  }

  if (except !== "rating" && !matchesRating(game, filters)) {
    return false;
  }

  if (except !== "players" && !matchesPlayers(game, filters)) {
    return false;
  }

  if (except !== "playTime" && !matchesPlayTimes(game, filters)) {
    return false;
  }

  if (except !== "age" && !matchesAge(game, filters)) {
    return false;
  }

  if (except !== "badge" && !matchesBadges(game, filters, flags)) {
    return false;
  }

  return true;
}

function compareName(left: Game, right: Game): number {
  return nameCollator.compare(left.name, right.name);
}

function orient(value: number, dir: SortDirection): number {
  return dir === "asc" ? value : -value;
}

function compareByRating(left: Game, right: Game, dir: SortDirection): number {
  const leftUnrated = left.ratingCount === 0;
  const rightUnrated = right.ratingCount === 0;

  if (leftUnrated || rightUnrated) {
    if (leftUnrated && rightUnrated) {
      return left.ratingCount - right.ratingCount || compareName(left, right);
    }

    return leftUnrated ? 1 : -1;
  }

  return (
    orient(left.ratingValue - right.ratingValue, dir) ||
    compareName(left, right)
  );
}

function comparatorFor(
  sort: SortKey,
  dir: SortDirection,
): (left: Game, right: Game) => number {
  switch (sort) {
    case "name":
      return (left, right) => orient(compareName(left, right), dir);
    case "price":
      return (left, right) =>
        orient(left.price - right.price, dir) || compareName(left, right);
    case "year":
      return (left, right) =>
        orient(left.publishedYear - right.publishedYear, dir) ||
        compareName(left, right);
    case "rating":
      return (left, right) => compareByRating(left, right, dir);
  }
}

function derivePublishers(games: Game[]): string[] {
  const names = new Set(games.map((game) => game.publisher));

  return [...names].toSorted((left, right) =>
    nameCollator.compare(left, right),
  );
}

function derivePriceBounds(games: Game[]): PriceBounds {
  return games.reduce<PriceBounds>(
    (bounds, game) => ({
      min: Math.min(bounds.min, game.price),
      max: Math.max(bounds.max, game.price),
    }),
    { min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY },
  );
}

function clampPrice(value: number | null, bounds: PriceBounds): number | null {
  return value === null
    ? null
    : Math.min(Math.max(value, bounds.min), bounds.max);
}

function buildPublisherOptions(
  games: Game[],
  names: string[],
  filters: CatalogFilters,
  flags: MerchandisingFlags,
): PublisherOption[] {
  const matching = games.filter((game) =>
    passesFilters(game, filters, flags, "publisher"),
  );

  return names.map((name) => ({
    name,
    count: matching.filter((game) => samePublisher(game.publisher, name))
      .length,
  }));
}

function buildCategoryOptions(
  games: Game[],
  filters: CatalogFilters,
  flags: MerchandisingFlags,
): CategoryOption[] {
  const matching = games.filter((game) =>
    passesFilters(game, filters, flags, "category"),
  );

  return (Object.entries(CATEGORY_LABELS) as [CategorySlug, string][]).map(
    ([slug, label]) => ({
      slug,
      label,
      count: matching.filter((game) => game.categories.includes(slug)).length,
    }),
  );
}

function buildFacetCounts(
  games: Game[],
  filters: CatalogFilters,
  flags: MerchandisingFlags,
): FacetCounts {
  const ratingGames = games.filter((game) =>
    passesFilters(game, filters, flags, "rating"),
  );
  const playerGames = games.filter((game) =>
    passesFilters(game, filters, flags, "players"),
  );
  const timeGames = games.filter((game) =>
    passesFilters(game, filters, flags, "playTime"),
  );
  const ageGames = games.filter((game) =>
    passesFilters(game, filters, flags, "age"),
  );
  const badgeGames = games.filter((game) =>
    passesFilters(game, filters, flags, "badge"),
  );

  return {
    rating: Object.fromEntries(
      RATING_OPTIONS.map((option): [string, number] => [
        String(option.value),
        ratingGames.filter((game) => game.ratingValue >= option.value).length,
      ]),
    ),
    players: Object.fromEntries(
      PLAYER_BUCKETS.map((option): [string, number] => [
        option.value,
        playerGames.filter((game) => matchesPlayerBucket(game, option.value))
          .length,
      ]),
    ),
    playTime: Object.fromEntries(
      PLAY_TIME_BUCKETS.map((option): [string, number] => [
        option.value,
        timeGames.filter((game) => matchesPlayTimeBucket(game, option.value))
          .length,
      ]),
    ),
    age: Object.fromEntries(
      AGE_OPTIONS.map((option): [string, number] => [
        String(option.value),
        ageGames.filter((game) => game.ageMin <= option.value).length,
      ]),
    ),
    badge: Object.fromEntries(
      BADGE_OPTIONS.map((option): [string, number] => [
        option.value,
        badgeGames.filter((game) => matchesBadge(game, option.value, flags))
          .length,
      ]),
    ),
  };
}

export function queryCatalog(filters: CatalogFilters): CatalogResult {
  const flags = getMerchandisingFlags();
  const active = activeGames();
  const priceBounds = derivePriceBounds(active);
  const priceMin = clampPrice(filters.priceMin, priceBounds);
  const priceMax = clampPrice(filters.priceMax, priceBounds);
  const bounded: CatalogFilters = { ...filters, priceMin, priceMax };

  const matching = active.filter((game) => passesFilters(game, bounded, flags));

  const total = matching.length;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(Math.max(filters.page, 1), pageCount);
  const effective: CatalogFilters = { ...bounded, page };

  const games = matching
    .toSorted(comparatorFor(effective.sort, effective.dir))
    .slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return {
    filters: effective,
    flags,
    games,
    total,
    pageCount,
    priceBounds,
    publishers: buildPublisherOptions(
      active,
      derivePublishers(active),
      effective,
      flags,
    ),
    categories: buildCategoryOptions(active, effective, flags),
    facetCounts: buildFacetCounts(active, effective, flags),
  };
}
