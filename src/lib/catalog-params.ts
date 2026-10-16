import { z } from "zod";

import { CATALOG_PATH, SORT_DEFAULT_DIR } from "@/constants/catalog-filters";
import {
  CATEGORY_LABELS,
  type CategorySlug,
} from "@/constants/game-categories";
import {
  AGE_THRESHOLD_VALUES,
  BADGE_FILTER_VALUES,
  PLAY_TIME_BUCKET_VALUES,
  PLAYER_BUCKET_VALUES,
  RATING_THRESHOLD_VALUES,
  SORT_DIRECTION_VALUES,
  SORT_KEY_VALUES,
  type AgeThreshold,
  type CatalogFilters,
  type RatingThreshold,
} from "@/types/catalog";

export type CatalogSearchParams = Record<string, string | string[] | undefined>;

function firstValue(value: string | string[] | undefined): string | undefined {
  const first = Array.isArray(value) ? value[0] : value;
  const trimmed = first?.trim();

  return trimmed === undefined || trimmed === "" ? undefined : trimmed;
}

function asArray(value: string | string[] | undefined): string[] {
  if (value === undefined) {
    return [];
  }

  return (Array.isArray(value) ? value : [value])
    .map((item) => item.trim())
    .filter((item) => item !== "");
}

function foldSearchTerm(value: string): string {
  return value.trim().normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
}

const categorySchema = z.enum(
  Object.keys(CATEGORY_LABELS) as [CategorySlug, ...CategorySlug[]],
);
const playerSchema = z.enum(PLAYER_BUCKET_VALUES);
const playTimeSchema = z.enum(PLAY_TIME_BUCKET_VALUES);
const badgeSchema = z.enum(BADGE_FILTER_VALUES);
const sortSchema = z.enum(SORT_KEY_VALUES);
const directionSchema = z.enum(SORT_DIRECTION_VALUES);

const ratingSchema = z
  .enum(RATING_THRESHOLD_VALUES.map(String) as [string, ...string[]])
  .transform((value) => Number(value) as RatingThreshold);

const ageSchema = z
  .enum(AGE_THRESHOLD_VALUES.map(String) as [string, ...string[]])
  .transform((value) => Number(value) as AgeThreshold);

const pageSchema = z.coerce.number().int().min(1);
const priceSchema = z.coerce.number().int();

function parseSingle<Output>(
  value: string | string[] | undefined,
  schema: z.ZodType<Output>,
  fallback: Output,
): Output {
  const result = schema.safeParse(firstValue(value));

  return result.success ? result.data : fallback;
}

function parseOptional<Output>(
  value: string | string[] | undefined,
  schema: z.ZodType<Output>,
): Output | null {
  const result = schema.safeParse(firstValue(value));

  return result.success ? result.data : null;
}

function parseRepeated<Output>(
  value: string | string[] | undefined,
  schema: z.ZodType<Output>,
): Output[] {
  const parsed: Output[] = [];

  for (const item of asArray(value)) {
    const result = schema.safeParse(item);

    if (result.success && !parsed.includes(result.data)) {
      parsed.push(result.data);
    }
  }

  return parsed;
}

function orderPrices(
  min: number | null,
  max: number | null,
): [number | null, number | null] {
  if (min !== null && max !== null && min > max) {
    return [max, min];
  }

  return [min, max];
}

export function parseCatalogFilters(
  searchParams: CatalogSearchParams,
): CatalogFilters {
  const sort = parseSingle(searchParams.sort, sortSchema, "name");
  const [priceMin, priceMax] = orderPrices(
    parseOptional(searchParams.priceMin, priceSchema),
    parseOptional(searchParams.priceMax, priceSchema),
  );

  return {
    q: foldSearchTerm(firstValue(searchParams.q) ?? ""),
    categories: parseRepeated(searchParams.category, categorySchema),
    publisher: firstValue(searchParams.publisher) ?? null,
    priceMin,
    priceMax,
    rating: parseOptional(searchParams.rating, ratingSchema),
    players: parseRepeated(searchParams.players, playerSchema),
    playTimes: parseRepeated(searchParams.time, playTimeSchema),
    ageMax: parseOptional(searchParams.age, ageSchema),
    badges: parseRepeated(searchParams.badge, badgeSchema),
    sort,
    dir: parseSingle(searchParams.dir, directionSchema, SORT_DEFAULT_DIR[sort]),
    page: parseSingle(searchParams.page, pageSchema, 1),
  };
}

export function withCatalogFilters(
  filters: CatalogFilters,
  patch: Partial<CatalogFilters>,
): CatalogFilters {
  return {
    ...filters,
    ...patch,
    q: patch.q === undefined ? filters.q : foldSearchTerm(patch.q),
    page: 1,
  };
}

export function buildCatalogHref(filters: CatalogFilters): string {
  const params = new URLSearchParams();

  if (filters.q !== "") {
    params.set("q", filters.q);
  }

  for (const category of filters.categories) {
    params.append("category", category);
  }

  if (filters.publisher !== null) {
    params.set("publisher", filters.publisher);
  }

  if (filters.priceMin !== null) {
    params.set("priceMin", String(filters.priceMin));
  }

  if (filters.priceMax !== null) {
    params.set("priceMax", String(filters.priceMax));
  }

  if (filters.rating !== null) {
    params.set("rating", String(filters.rating));
  }

  for (const players of filters.players) {
    params.append("players", players);
  }

  for (const time of filters.playTimes) {
    params.append("time", time);
  }

  if (filters.ageMax !== null) {
    params.set("age", String(filters.ageMax));
  }

  for (const badge of filters.badges) {
    params.append("badge", badge);
  }

  if (filters.sort !== "name") {
    params.set("sort", filters.sort);
  }

  if (filters.dir !== SORT_DEFAULT_DIR[filters.sort]) {
    params.set("dir", filters.dir);
  }

  if (filters.page > 1) {
    params.set("page", String(filters.page));
  }

  const query = params.toString();

  return query === "" ? CATALOG_PATH : `${CATALOG_PATH}?${query}`;
}
