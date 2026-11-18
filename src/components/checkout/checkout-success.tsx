"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { formatDate, formatVnd } from "@/lib/format";
import { getOrder } from "@/services/orders";
import { useCartStore, useSessionStore } from "@/store";
import type { Order } from "@/types/checkout";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/common/button-link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

interface CheckoutSuccessProps {
  orderCode: string;
}

export function CheckoutSuccess({ orderCode }: CheckoutSuccessProps) {
  const router = useRouter();
  const accountId = useSessionStore((state) => state.user?.id ?? null);
  const clearCart = useCartStore((state) => state.clear);

  const [order, setOrder] = useState<Order | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const clearedRef = useRef(false);

  useEffect(() => {
    if (!accountId) return;

    let active = true;

    getOrder(orderCode, accountId)
      .then((result) => {
        if (!active) return;

        if (result && result.status === "pending") {
          router.replace(`/checkout/pay?order=${result.code}`);
          return;
        }

        if (result && result.status === "failed") {
          router.replace(`/checkout/failed?order=${result.code}`);
          return;
        }

        setOrder(result);
        setIsLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setOrder(undefined);
        setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [accountId, orderCode, router]);

  useEffect(() => {
    if (!order || order.status !== "paid" || clearedRef.current) return;
    clearedRef.current = true;
    clearCart();
  }, [order, clearCart]);

  if (isLoading) {
    return (
      <Card className="max-w-xl">
        <CardContent className="flex flex-col gap-4">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-56" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-4 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!order) {
    return (
      <Card className="max-w-xl">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle>Payment confirmed</CardTitle>
            <Badge>Paid</Badge>
          </div>
          <p className="text-sm text-muted-foreground">Reference {orderCode}</p>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm">
          <p>
            Your payment was recorded, but the full order summary is unavailable on this device.
          </p>
          <p className="text-muted-foreground">
            Keep the reference above in case you need to contact support.
          </p>
        </CardContent>
        <CardFooter>
          <ButtonLink href="/products">Continue shopping</ButtonLink>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle>Thank you for your order</CardTitle>
          <Badge>Paid</Badge>
        </div>
        <p className="text-sm text-muted-foreground">Reference {order.code}</p>
      </CardHeader>

      <CardContent className="flex flex-col gap-5">
        <div className="flex flex-col gap-3">
          {order.lines.map((line) => (
            <div key={line.id} className="flex items-start justify-between gap-4 text-sm">
              <div className="flex min-w-0 flex-col">
                <span className="truncate font-medium">{line.name}</span>
                <span className="text-muted-foreground">
                  Qty {line.quantity} × {formatVnd(line.unitPrice)}
                </span>
              </div>
              <span className="shrink-0 font-medium">{formatVnd(line.lineTotal)}</span>
            </div>
          ))}
        </div>

        <Separator />

        <div className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">{formatVnd(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Delivery ({order.deliveryTier.label})</span>
            <span className="font-medium">{formatVnd(order.deliveryFee)}</span>
          </div>
          {order.voucher ? (
            <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
              <span>Discount ({order.voucher.code})</span>
              <span className="font-medium">-{formatVnd(order.discount)}</span>
            </div>
          ) : null}
        </div>

        <Separator />

        <div className="flex items-center justify-between text-base font-semibold">
          <span>Total</span>
          <span className="font-heading text-lg text-primary">{formatVnd(order.total)}</span>
        </div>

        <Separator />

        <div className="flex flex-col gap-2 text-sm">
          <p className="font-medium">Delivery address</p>
          <p className="text-muted-foreground">
            {order.address.recipientName} · {order.address.phone}
          </p>
          <p className="text-muted-foreground">
            {order.address.line1}, {order.address.ward}, {order.address.district},{" "}
            {order.address.province}
          </p>
          <p className="text-muted-foreground">
            Estimated delivery: {formatDate(order.estimatedDeliveryFrom)} –{" "}
            {formatDate(order.estimatedDeliveryTo)}
          </p>
        </div>
      </CardContent>

      <CardFooter>
        <ButtonLink href="/products">Continue shopping</ButtonLink>
      </CardFooter>
    </Card>
  );
}
