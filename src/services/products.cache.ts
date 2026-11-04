"use cache";

import { cacheLife } from "next/cache";

import { getBestSellers, getDailyPick, getNewArrivals } from "@/services/products";
import type { Product } from "@/types/product";

export async function getDailyPickCached(): Promise<Product | null> {
  cacheLife("hours");
  return getDailyPick(new Date());
}

export async function getBestSellersCached(): Promise<Product[]> {
  cacheLife("hours");
  return getBestSellers();
}

export async function getNewArrivalsCached(): Promise<Product[]> {
  cacheLife("hours");
  return getNewArrivals();
}
