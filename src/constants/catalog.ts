export const CATALOG_PAGE_SIZE = 12;

export const DISCOUNT_THRESHOLD = 5;

export const BADGE_OPTIONS = [
  { value: "bestseller", label: "Best seller" },
  { value: "new", label: "New arrivals" },
  { value: "sale", label: "On sale" },
] as const;

export const GENRE_OPTIONS = [
  { value: "Strategy", label: "Strategy" },
  { value: "Family", label: "Family" },
  { value: "Party", label: "Party" },
  { value: "Cooperative", label: "Cooperative" },
] as const;

export const PUBLISHER_OPTIONS = [
  "Asmodee",
  "Cephalofair Games",
  "Czech Games Edition",
  "Days of Wonder",
  "Exploding Kittens",
  "Hans im Glück",
  "KOSMOS",
  "Libellud",
  "Plan B Games",
  "Repos Production",
  "Roxley Games",
  "Space Cowboys",
  "Starling Games",
  "Stonemaier Games",
  "Z-Man Games",
] as const;

export const PRICE_BUCKETS = [
  { value: "under-500", label: "Under 500,000₫", min: 0, max: 500_000 },
  { value: "500-1000", label: "500,000₫ – 1,000,000₫", min: 500_000, max: 1_000_000 },
  { value: "1000-1500", label: "1,000,000₫ – 1,500,000₫", min: 1_000_000, max: 1_500_000 },
  { value: "over-1500", label: "Over 1,500,000₫", min: 1_500_000, max: Infinity },
] as const;

export const SORT_OPTIONS = [
  { value: "popularity", label: "Most popular" },
  { value: "name", label: "Name (A-Z)" },
  { value: "price", label: "Price" },
  { value: "rating", label: "Rating" },
] as const;
