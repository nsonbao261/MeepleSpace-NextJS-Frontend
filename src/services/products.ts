import { getDayOfYear } from "date-fns";

import { curated, products } from "@/data";
import type { Product } from "@/types";

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
