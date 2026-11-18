"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { formatVnd } from "@/lib/format";
import { createOrder, getOrder } from "@/services/orders";
import { useSessionStore } from "@/store";
import type { Order, OrderLineInput } from "@/types/checkout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/common/button-link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toast";

interface CheckoutFailedProps {
  orderCode: string;
}

export function CheckoutFailed({ orderCode }: CheckoutFailedProps) {
  const router = useRouter();
  const accountId = useSessionStore((state) => state.user?.id ?? null);

  const [order, setOrder] = useState<Order | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    if (!accountId) return;

    let active = true;

    getOrder(orderCode, accountId)
      .then((result) => {
        if (!active) return;

        if (!result) {
          router.replace("/checkout");
          return;
        }

        if (result.status === "paid") {
          router.replace(`/checkout/success?order=${result.code}`);
          return;
        }

        if (result.status === "pending") {
          router.replace(`/checkout/pay?order=${result.code}`);
          return;
        }

        setOrder(result);
        setIsLoading(false);
      })
      .catch(() => {
        if (!active) return;
        router.replace("/checkout");
      });

    return () => {
      active = false;
    };
  }, [accountId, orderCode, router]);

  async function handleRetry() {
    if (isRetrying || !order || !accountId) return;

    setIsRetrying(true);
    try {
      const lines: OrderLineInput[] = order.lines.map((line) => ({
        id: line.id,
        kind: line.kind,
        productId: line.productId,
        slug: line.slug,
        name: line.name,
        image: line.image,
        unitPrice: line.unitPrice,
        quantity: line.quantity,
      }));

      const nextOrder = await createOrder({
        accountId,
        lines,
        address: order.address,
        deliveryTierId: order.deliveryTier.id,
        voucherCode: order.voucher?.code,
        voucherPercent: order.voucher?.percent,
      });

      router.replace(`/checkout/pay?order=${nextOrder.code}`);
    } catch {
      toast.add({
        type: "error",
        title: "Could not retry payment",
        description: "Please try again.",
      });
      setIsRetrying(false);
    }
  }

  if (isLoading || !order) {
    return (
      <Card className="max-w-xl">
        <CardContent className="flex flex-col gap-4">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-56" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-9 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle>Payment was not completed</CardTitle>
          <Badge variant="destructive">Failed</Badge>
        </div>
        <p className="text-sm text-muted-foreground">Order {order.code}</p>
      </CardHeader>

      <CardContent className="flex flex-col gap-5">
        <p className="text-sm">
          The sandbox did not complete this payment. No real charge was made and your order was not
          confirmed.
        </p>

        <dl className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Amount</dt>
            <dd className="font-heading text-lg font-semibold text-primary">
              {formatVnd(order.total)}
            </dd>
          </div>
        </dl>

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
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/cart" variant="outline" className="w-full sm:w-auto">
          Back to cart
        </ButtonLink>
        <Button
          type="button"
          className="w-full sm:ml-auto sm:w-auto"
          disabled={isRetrying}
          onClick={handleRetry}
        >
          {isRetrying ? "Preparing..." : "Retry payment"}
        </Button>
      </CardFooter>
    </Card>
  );
}
