"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { PAYMENT_RESULT_CODES } from "@/constants/checkout";
import { formatVnd } from "@/lib/format";
import { getOrder, setOrderPersistence, setOrderStatus } from "@/services/orders";
import { consumeVoucher } from "@/services/vouchers";
import { useCartStore, useSessionStore } from "@/store";
import type { Order } from "@/types/checkout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toast";

interface PaymentGatewayProps {
  orderCode: string;
}

interface PaymentGatewayState {
  order: Order | undefined;
  isLoading: boolean;
  isSubmitting: boolean;
  persist: boolean;
}

//Rediect base on Payment Status
export function PaymentGateway({ orderCode }: PaymentGatewayProps) {
  const router = useRouter();
  const accountId = useSessionStore((state) => state.user?.id ?? null);

  const [state, setState] = useState<PaymentGatewayState>({
    order: undefined,
    isLoading: true,
    isSubmitting: false,
    persist: true,
  });

  useEffect(() => {
    if (!accountId) return;

    if (!orderCode) {
      router.replace("/checkout");
      return;
    }

    let active = true;

    getOrder(orderCode, accountId)
      .then((order) => {
        if (!active) return;

        if (!order) {
          router.replace("/checkout");
          return;
        }

        if (order.status === "paid") {
          router.replace(`/checkout/success?order=${order.code}`);
          return;
        }

        if (order.status === "failed") {
          router.replace(`/checkout/failed?order=${order.code}`);
          return;
        }

        setOrderPersistence(orderCode, true);
        setState({
          order,
          isLoading: false,
          isSubmitting: false,
          persist: true,
        });
      })
      .catch(() => {
        if (!active) return;
        toast.add({
          type: "error",
          title: "Could not load order",
          description: "Please try again.",
        });
        router.replace("/checkout");
      });

    return () => {
      active = false;
    };
  }, [accountId, orderCode, router]);

  //Handle If the order storage is persisted
  function handlePersistenceChange(checked: boolean) {
    setState((current) => ({ ...current, persist: checked }));
    setOrderPersistence(orderCode, checked);
  }

  /** Returns the order only while it is still pending; redirects otherwise. */
  async function rereadPendingOrder(): Promise<Order | null> {
    if (!accountId) return null;

    const order = await getOrder(orderCode, accountId);

    if (!order) {
      router.replace("/checkout");
      return null;
    }

    if (order.status === "paid") {
      router.replace(`/checkout/success?order=${order.code}`);
      return null;
    }

    if (order.status === "failed") {
      router.replace(`/checkout/failed?order=${order.code}`);
      return null;
    }

    return order;
  }

  async function handleSuccess() {
    if (state.isSubmitting || !accountId) return;

    setState((current) => ({ ...current, isSubmitting: true }));

    try {
      const order = await rereadPendingOrder();
      if (!order) return;

      await setOrderStatus(order.code, "paid");
      if (order.voucher) {
        await consumeVoucher(accountId, order.voucher.code);
      }
      useCartStore.getState().clear();
      router.replace(`/checkout/success?order=${order.code}`);
    } catch {
      toast.add({
        type: "error",
        title: "Payment failed",
        description: "The sandbox could not confirm this payment. Please try again.",
      });
      setState((current) => ({ ...current, isSubmitting: false }));
    }
  }

  async function handleFailure() {
    if (state.isSubmitting || !accountId) return;

    setState((current) => ({ ...current, isSubmitting: true }));

    try {
      const order = await rereadPendingOrder();
      if (!order) return;

      await setOrderStatus(order.code, "failed");
      router.replace(`/checkout/failed?order=${order.code}`);
    } catch {
      toast.add({
        type: "error",
        title: "Could not update order",
        description: "Please try again.",
      });
      setState((current) => ({ ...current, isSubmitting: false }));
    }
  }

  if (state.isLoading || !state.order) {
    return (
      <Card>
        <CardContent className="flex flex-col gap-4">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-64" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-9 w-full" />
        </CardContent>
      </Card>
    );
  }

  const order = state.order;

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle>Sandbox payment</CardTitle>
          <Badge variant="secondary">Sandbox</Badge>
        </div>
        <p className="text-sm text-muted-foreground">Order {order.code}</p>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 rounded-lg border border-dashed bg-muted/40 p-4 text-sm">
          <p className="font-medium">No real payment happens here.</p>
          <p className="text-muted-foreground">
            VNPAY result codes: success {PAYMENT_RESULT_CODES.success}, failure{" "}
            {PAYMENT_RESULT_CODES.failed}.
          </p>
        </div>

        <dl className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Order code</dt>
            <dd className="font-medium">{order.code}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Items</dt>
            <dd className="font-medium">{order.itemCount}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Amount</dt>
            <dd className="font-heading text-lg font-semibold text-primary">
              {formatVnd(order.total)}
            </dd>
          </div>
        </dl>

        <Separator />

        <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <Checkbox
            checked={state.persist}
            disabled={state.isSubmitting}
            onCheckedChange={(checked) => handlePersistenceChange(checked === true)}
          />
          Keep this order on this device
        </label>
      </CardContent>

      <CardFooter className="flex flex-col gap-3 sm:flex-row">
        <Button
          type="button"
          variant="outline"
          className="w-full sm:w-auto"
          disabled={state.isSubmitting}
          onClick={handleFailure}
        >
          Simulate failure
        </Button>
        <Button
          type="button"
          className="w-full sm:ml-auto sm:w-auto"
          disabled={state.isSubmitting}
          onClick={handleSuccess}
        >
          {state.isSubmitting ? "Processing..." : `Pay ${formatVnd(order.total)}`}
        </Button>
      </CardFooter>
    </Card>
  );
}
