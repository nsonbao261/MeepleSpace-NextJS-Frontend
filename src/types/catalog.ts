import type { CategorySlug } from "@/constants/game-categories";
import type { Game } from "@/types/game";

export const SORT_KEY_VALUES = ["name", "price", "year", "rating"] as const;

export type SortKey = (typeof SORT_KEY_VALUES)[number];

export const SORT_DIRECTION_VALUES = ["asc", "desc"] as const;

export type SortDirection = (typeof SORT_DIRECTION_VALUES)[number];

export const FACET_KEY_VALUES = [
  "rating",
  "players",
  "playTime",
  "age",
  "badge",
] as const;

export type FacetKey = (typeof FACET_KEY_VALUES)[number];

export const PLAYER_BUCKET_VALUES = ["1-2", "3-4", "5-6", "7-10"] as const;

export type PlayerBucket = (typeof PLAYER_BUCKET_VALUES)[number];

export const PLAY_TIME_BUCKET_VALUES = [
  "under-30",
  "30-60",
  "60-120",
  "over-120",
] as const;

export type PlayTimeBucket = (typeof PLAY_TIME_BUCKET_VALUES)[number];

export const RATING_THRESHOLD_VALUES = [3.5, 4, 4.5] as const;

export type RatingThreshold = (typeof RATING_THRESHOLD_VALUES)[number];

export const AGE_THRESHOLD_VALUES = [6, 8, 10, 12, 14] as const;

export type AgeThreshold = (typeof AGE_THRESHOLD_VALUES)[number];

export const BADGE_FILTER_VALUES = ["sale", "new", "best", "in-stock"] as const;

export type BadgeFilter = (typeof BADGE_FILTER_VALUES)[number];

export type CatalogFilters = {
  q: string;
  categories: CategorySlug[];
  publisher: string | null;
  priceMin: number | null;
  priceMax: number | null;
  rating: RatingThreshold | null;
  players: PlayerBucket[];
  playTimes: PlayTimeBucket[];
  ageMax: AgeThreshold | null;
  badges: BadgeFilter[];
  sort: SortKey;
  dir: SortDirection;
  page: number;
};

export type PriceBounds = { min: number; max: number };

export type PublisherOption = { name: string; count: number };

export type CategoryOption = {
  slug: CategorySlug;
  label: string;
  count: number;
};

export type MerchandisingFlags = {
  newIds: Set<string>;
  bestSellerIds: Set<string>;
};

export type FacetCounts = Record<FacetKey, Record<string, number>>;

export type CatalogResult = {
  filters: CatalogFilters;
  flags: MerchandisingFlags;
  games: Game[];
  total: number;
  pageCount: number;
  priceBounds: PriceBounds;
  publishers: PublisherOption[];
  categories: CategoryOption[];
  facetCounts: FacetCounts;
};
