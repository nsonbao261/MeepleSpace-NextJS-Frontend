import { addDays } from "date-fns";
import { DeliveryTierId, DeliveryTier } from "@/types/checkout";
import { CartLine } from "@/types/cart";
import { DELIVERY_TIERS } from "@/constants/checkout";

export interface ComputeTotalsInput {
  subtotal: number;
  deliveryFee: number;
  percent?: number;
}

export interface ComputeTotalsResult {
  discount: number;
  total: number;
}

export function computeTotals({
  subtotal,
  deliveryFee,
  percent = 0,
}: ComputeTotalsInput): ComputeTotalsResult {
  const discount = Math.round((subtotal * percent) / 100);
  const total = Math.max(0, subtotal - discount + deliveryFee);
  return {
    discount,
    total,
  };
}

export interface DeliveryEstimateResult {
  from: string;
  to: string;
  tier: DeliveryTier;
}

export function getDeliveryEstimate(
  tierInput: DeliveryTierId | DeliveryTier,
  from: Date = new Date(),
): DeliveryEstimateResult {
  const tier =
    typeof tierInput === "object" && tierInput !== null
      ? tierInput
      : DELIVERY_TIERS.find((t) => t.id === tierInput) || DELIVERY_TIERS[0];

  const minDays = tier.minDays;
  const maxDays = tier.maxDays;
  const fromIso = addDays(from, minDays).toISOString();
  const toIso = addDays(from, maxDays).toISOString();
  return {
    from: fromIso,
    to: toIso,
    tier,
  };
}

export function cartSubtotal(lines: CartLine[]): number {
  return lines.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
}

export function cartItemCount(lines: CartLine[]): number {
  return lines.reduce((count, item) => count + item.quantity, 0);
}
