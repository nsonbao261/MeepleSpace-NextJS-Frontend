import type {
  AgeThreshold,
  BadgeFilter,
  CatalogFilters,
  PlayTimeBucket,
  PlayerBucket,
  RatingThreshold,
  SortDirection,
  SortKey,
} from "@/types/catalog";

export const CATALOG_PATH = "/catalog";

export const PAGE_SIZE = 24;

export const PRICE_STEP = 10_000;

export const PLAYER_BUCKETS = [
  { value: "1-2", label: "1–2 players", min: 1, max: 2 },
  { value: "3-4", label: "3–4 players", min: 3, max: 4 },
  { value: "5-6", label: "5–6 players", min: 5, max: 6 },
  { value: "7-10", label: "7–10 players", min: 7, max: 10 },
] as const satisfies readonly {
  value: PlayerBucket;
  label: string;
  min: number;
  max: number;
}[];

export const PLAY_TIME_BUCKETS = [
  { value: "under-30", label: "Under 30 min", min: 0, max: 29 },
  { value: "30-60", label: "30–60 min", min: 30, max: 60 },
  { value: "60-120", label: "60–120 min", min: 61, max: 120 },
  {
    value: "over-120",
    label: "Over 120 min",
    min: 121,
    max: Number.POSITIVE_INFINITY,
  },
] as const satisfies readonly {
  value: PlayTimeBucket;
  label: string;
  min: number;
  max: number;
}[];

export const RATING_OPTIONS = [
  { value: 3.5, label: "3.5+" },
  { value: 4, label: "4.0+" },
  { value: 4.5, label: "4.5+" },
] as const satisfies readonly { value: RatingThreshold; label: string }[];

export const AGE_OPTIONS = [
  { value: 6, label: "6+" },
  { value: 8, label: "8+" },
  { value: 10, label: "10+" },
  { value: 12, label: "12+" },
  { value: 14, label: "14+" },
] as const satisfies readonly { value: AgeThreshold; label: string }[];

export const BADGE_OPTIONS = [
  { value: "sale", label: "On Sale" },
  { value: "new", label: "New Arrival" },
  { value: "best", label: "Best Seller" },
  { value: "in-stock", label: "In Stock" },
] as const satisfies readonly { value: BadgeFilter; label: string }[];

export const SORT_OPTIONS = [
  { value: "name", label: "Name" },
  { value: "price", label: "Price" },
  { value: "year", label: "Publish year" },
  { value: "rating", label: "Rating" },
] as const satisfies readonly { value: SortKey; label: string }[];

export const SORT_DEFAULT_DIR = {
  name: "asc",
  price: "asc",
  year: "desc",
  rating: "desc",
} as const satisfies Record<SortKey, SortDirection>;

export const DEFAULT_CATALOG_FILTERS: CatalogFilters = {
  q: "",
  categories: [],
  publisher: null,
  priceMin: null,
  priceMax: null,
  rating: null,
  players: [],
  playTimes: [],
  ageMax: null,
  badges: [],
  sort: "name",
  dir: SORT_DEFAULT_DIR.name,
  page: 1,
};
