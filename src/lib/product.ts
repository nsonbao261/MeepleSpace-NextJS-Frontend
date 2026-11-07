import { DISCOUNT_THRESHOLD } from "@/constants";

export interface DiscountInfo {
  /** True when the original price is set and higher than the current price. */
  hasDiscount: boolean;
  /** Rounded percentage, e.g. 12 for 12%. */
  percent: number;
  /** Whether the discount is large enough to show the pill. */
  showPill: boolean;
}

/** Shared discount math for the product card and the detail hero. */
export function getDiscount(price: number, originalPrice?: number): DiscountInfo {
  const hasDiscount = originalPrice !== undefined && originalPrice > price;

  if (!hasDiscount) {
    return { hasDiscount: false, percent: 0, showPill: false };
  }

  const rawPercent = ((originalPrice - price) / originalPrice) * 100;
  const percent = Math.round(rawPercent);

  return {
    hasDiscount: true,
    percent,
    showPill: rawPercent >= DISCOUNT_THRESHOLD,
  };
}
