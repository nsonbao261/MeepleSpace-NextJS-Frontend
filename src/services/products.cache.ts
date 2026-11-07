"use cache";

import { cacheLife } from "next/cache";

import {
  getBestSellers,
  getCatalog,
  getDailyPicks,
  getNewArrivals,
  getProductBySlug,
  getExpansionsForProduct,
  getRelatedProducts,
} from "@/services/products";
import { getReviewSummary, getReviewsForProduct } from "@/services/reviews";
import type { Product, ProductDetail } from "@/types";

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

/** One cached read for the whole detail page. */
export async function getProductDetailCached(slug: string): Promise<ProductDetail | null> {
  cacheLife("hours");

  const product = getProductBySlug(slug);
  if (!product) return null;

  return {
    product,
    expansions: getExpansionsForProduct(product.id),
    related: getRelatedProducts(product),
    reviews: getReviewsForProduct(product.id),
    summary: getReviewSummary(product.id),
  };
}
