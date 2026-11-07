import { getDayOfYear } from "date-fns";

import { RELATED_PRODUCTS_LIMIT } from "@/constants";
import { curated, expansions, products } from "@/data";
import type { Expansion, Product } from "@/types";

const RAIL_SIZE = 8;
const DAILY_PICK_SIZE = 4;

/** Ranked by sales volume; out-of-stock items stay listed, the card disables purchase. */
export function getBestSellers(): Product[] {
  return [...products].sort((a, b) => b.salesCount - a.salesCount).slice(0, RAIL_SIZE);
}

/** Ranked by newest first. */
export function getNewArrivals(): Product[] {
  return [...products].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, RAIL_SIZE);
}

/** Full catalogue of base games sorted by salesCount desc. */
export function getCatalog(): Product[] {
  return [...products].sort((a, b) => b.salesCount - a.salesCount);
}

/** Every base slug, used by `generateStaticParams`. */
export function getAllProductSlugs(): string[] {
  return products.map((product) => product.slug);
}

/**
 * Up to four curated games per day by day-of-year index, skipping
 * out-of-stock entries without repeats. Returns fewer when the pool runs dry.
 */
export function getDailyPicks(date: Date): Product[] {
  if (curated.length === 0) return [];

  const start = getDayOfYear(date) % curated.length;
  const picks: Product[] = [];
  for (let offset = 0; offset < curated.length && picks.length < DAILY_PICK_SIZE; offset++) {
    const pick = curated[(start + offset) % curated.length];
    if (pick.stock > 0) picks.push(pick);
  }
  return picks;
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getExpansionsForProduct(baseProductId: string): Expansion[] {
  return expansions.filter((e) => e.baseProductId === baseProductId);
}

/** Same genre first, then other base games, both ranked by sales; current excluded. */
export function getRelatedProducts(product: Product): Product[] {
  const bySales = (a: Product, b: Product) => b.salesCount - a.salesCount;
  const sameGenre = products
    .filter((p) => p.genre === product.genre && p.slug !== product.slug)
    .sort(bySales);
  const others = products
    .filter((p) => p.genre !== product.genre && p.slug !== product.slug)
    .sort(bySales);

  return [...sameGenre, ...others].slice(0, RELATED_PRODUCTS_LIMIT);
}
