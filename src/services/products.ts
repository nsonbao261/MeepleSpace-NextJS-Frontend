import { getDayOfYear } from "date-fns";

import { curated, products } from "@/data/products.mock";
import type { Product } from "@/types/product";

const RAIL_SIZE = 8;

/** Ranked by sales volume; out-of-stock items stay listed, the card disables purchase. */
export function getBestSellers(): Product[] {
  return [...products].sort((a, b) => b.salesCount - a.salesCount).slice(0, RAIL_SIZE);
}

/** Ranked by newest first. */
export function getNewArrivals(): Product[] {
  return [...products].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, RAIL_SIZE);
}

/**
 * One curated game per day by day-of-year index, skipping out-of-stock
 * entries. Returns null when none is available.
 */
export function getDailyPick(date: Date): Product | null {
  if (curated.length === 0) return null;

  const start = getDayOfYear(date) % curated.length;
  for (let offset = 0; offset < curated.length; offset++) {
    const pick = curated[(start + offset) % curated.length];
    if (pick.stock > 0) return pick;
  }
  return null;
}
