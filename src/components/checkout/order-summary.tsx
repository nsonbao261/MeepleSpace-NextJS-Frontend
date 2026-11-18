"use client";

import { DELIVERY_TIERS } from "@/constants/checkout";
import { formatVnd } from "@/lib/format";
import type { AppliedVoucher, DeliveryTierId } from "@/types/checkout";
import type { CartLine } from "@/types/cart";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface OrderSummaryProps {
  lines: CartLine[];
  itemCount: number;
  subtotal: number;
  deliveryTierId: DeliveryTierId;
  voucher: AppliedVoucher | null;
  total: number;
  pending: boolean;
  disabled: boolean;
  onPlaceOrder: () => void;
}

export function OrderSummary({
  lines,
  itemCount,
  subtotal,
  deliveryTierId,
  voucher,
  total,
  pending,
  disabled,
  onPlaceOrder,
}: OrderSummaryProps) {
  const deliveryTier =
    DELIVERY_TIERS.find((tier) => tier.id === deliveryTierId) ?? DELIVERY_TIERS[0];

  return (
    <div className="flex flex-col gap-5 rounded-xl border bg-card p-6 shadow-xs">
      <div className="flex flex-col gap-1">
        <h2 className="font-heading text-lg font-semibold">Order summary</h2>
        <p className="text-sm text-muted-foreground">Review your order before placing it.</p>
      </div>

      <div className="flex flex-col gap-3">
        {lines.map((line) => (
          <div key={line.id} className="flex items-start justify-between gap-4 text-sm">
            <div className="flex min-w-0 flex-col">
              <span className="truncate font-medium">{line.name}</span>
              <span className="text-muted-foreground">
                Qty {line.quantity} × {formatVnd(line.unitPrice)}
              </span>
            </div>
            <span className="shrink-0 font-medium">
              {formatVnd(line.unitPrice * line.quantity)}
            </span>
          </div>
        ))}
      </div>

      <Separator />

      <div className="flex flex-col gap-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Items ({itemCount})</span>
          <span>{itemCount}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium">{formatVnd(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Delivery</span>
          <span className="font-medium">{formatVnd(deliveryTier.fee)}</span>
        </div>
        {voucher ? (
          <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
            <span>Discount ({voucher.code})</span>
            <span className="font-medium">-{formatVnd(voucher.discountAmount)}</span>
          </div>
        ) : null}
      </div>

      <Separator />

      <div className="flex items-center justify-between text-base font-semibold">
        <span>Total</span>
        <span className="font-heading text-lg text-primary">{formatVnd(total)}</span>
      </div>

      <Button
        type="button"
        size="lg"
        className="w-full"
        onClick={onPlaceOrder}
        disabled={pending || disabled}
      >
        {pending ? "Placing order..." : "Place order"}
      </Button>
    </div>
  );
}
