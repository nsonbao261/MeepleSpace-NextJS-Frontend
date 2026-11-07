"use cache";

import { cacheLife } from "next/cache";

import { getBestSellers, getCatalog, getDailyPicks, getNewArrivals } from "@/services/products";
import type { Product } from "@/types";

export async function getDailyPicksCached(): Promise<Product[]> {
  cacheLife("hours");
  return getDailyPicks(new Date());
}

export async function getBestSellersCached(): Promise<Product[]> {
  cacheLife("hours");
  return getBestSellers();
}

export async function getNewArrivalsCached(): Promise<Product[]> {
  cacheLife("hours");
  return getNewArrivals();
}

export async function getCatalogCached(): Promise<Product[]> {
  cacheLife("hours");
  return getCatalog();
}
