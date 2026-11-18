"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { DELIVERY_TIERS } from "@/constants/checkout";
import { computeTotals } from "@/lib/checkout";
import { getAddresses } from "@/services/addresses";
import { createOrder } from "@/services/orders";
import { useCartStore, useSessionStore } from "@/store";
import type { Address, AppliedVoucher, DeliveryTierId, OrderLineInput } from "@/types/checkout";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { AddressPicker } from "./address-picker";
import { DeliveryPicker } from "./delivery-picker";
import { MapPlaceholder } from "./map-placeholder";
import { OrderSummary } from "./order-summary";
import { VoucherField } from "./voucher-field";

export function CheckoutView() {
  const router = useRouter();
  const lines = useCartStore((state) => state.lines);
  const itemCount = useCartStore((state) => state.itemCount);
  const subtotal = useCartStore((state) => state.subtotal);
  const accountId = useSessionStore((state) => state.user?.id ?? null);

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [deliveryTierId, setDeliveryTierId] = useState<DeliveryTierId>("free");
  const [appliedVoucher, setAppliedVoucher] = useState<AppliedVoucher | null>(null);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
  const [addressError, setAddressError] = useState<string | null>(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [addressReloadKey, setAddressReloadKey] = useState(0);

  useEffect(() => {
    if (lines.length === 0) {
      router.replace("/cart");
    }
  }, [lines.length, router]);

  useEffect(() => {
    if (!accountId) {
      return;
    }

    let active = true;

    getAddresses(accountId)
      .then((result) => {
        if (!active) return;
        setAddresses(result);
        setSelectedAddressId((current) => {
          if (current && result.some((address) => address.id === current)) {
            return current;
          }
          const preferred = result.find((address) => address.isDefault) ?? result[0] ?? null;
          return preferred?.id ?? null;
        });
        setAddressError(null);
        setIsLoadingAddresses(false);
      })
      .catch(() => {
        if (!active) return;
        setAddressError("Could not load your addresses. Please try again.");
        setIsLoadingAddresses(false);
      });

    return () => {
      active = false;
    };
  }, [accountId, addressReloadKey]);

  function retryLoadAddresses() {
    setIsLoadingAddresses(true);
    setAddressError(null);
    setAddressReloadKey((key) => key + 1);
  }

  const selectedAddress = useMemo(
    () => addresses.find((address) => address.id === selectedAddressId) ?? null,
    [addresses, selectedAddressId],
  );

  const selectedTier = useMemo(
    () => DELIVERY_TIERS.find((tier) => tier.id === deliveryTierId) ?? DELIVERY_TIERS[0],
    [deliveryTierId],
  );

  const { discount, total } = useMemo(
    () =>
      computeTotals({
        subtotal,
        deliveryFee: selectedTier.fee,
        percent: appliedVoucher?.percent ?? 0,
      }),
    [subtotal, selectedTier.fee, appliedVoucher?.percent],
  );

  const displayVoucher = useMemo(
    () => (appliedVoucher ? { ...appliedVoucher, discountAmount: discount } : null),
    [appliedVoucher, discount],
  );

  function handleAddAddress(address: Address) {
    setAddresses((current) => [...current, address]);
    setSelectedAddressId(address.id);
  }

  async function handlePlaceOrder() {
    if (isPlacingOrder) return;
    if (!accountId || lines.length === 0 || !selectedAddress) return;

    setIsPlacingOrder(true);
    try {
      const orderLines: OrderLineInput[] = lines.map((line) => ({
        id: line.id,
        kind: line.kind,
        productId: line.productId,
        slug: line.slug,
        name: line.name,
        image: line.image,
        unitPrice: line.unitPrice,
        quantity: line.quantity,
      }));

      const order = await createOrder({
        accountId,
        lines: orderLines,
        address: selectedAddress,
        deliveryTierId,
        voucherCode: appliedVoucher?.code,
        voucherPercent: appliedVoucher?.percent,
      });

      router.push(`/checkout/pay?order=${order.code}`);
    } catch {
      toast.add({
        type: "error",
        title: "Could not place order",
        description: "Please try again.",
      });
      setIsPlacingOrder(false);
    }
  }

  if (lines.length === 0) {
    return null;
  }

  const canPlaceOrder =
    !isPlacingOrder &&
    !isLoadingAddresses &&
    !!accountId &&
    lines.length > 0 &&
    !!selectedAddress &&
    !addressError;

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
      <div className="flex flex-col gap-6">
        <section className="rounded-xl border bg-card p-6 shadow-xs">
          {isLoadingAddresses ? (
            <div className="flex flex-col gap-4">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : addressError ? (
            <div className="flex flex-col gap-3">
              <p className="text-sm font-medium">Delivery address</p>
              <p className="text-sm text-destructive">{addressError}</p>
              <div>
                <Button type="button" variant="outline" onClick={retryLoadAddresses}>
                  Retry
                </Button>
              </div>
            </div>
          ) : (
            <AddressPicker
              addresses={addresses}
              selectedId={selectedAddressId}
              onSelect={setSelectedAddressId}
              onAdd={handleAddAddress}
            />
          )}
        </section>

        <section className="rounded-xl border bg-card p-6 shadow-xs">
          <MapPlaceholder address={selectedAddress} />
        </section>

        <section className="rounded-xl border bg-card p-6 shadow-xs">
          <DeliveryPicker value={deliveryTierId} onChange={setDeliveryTierId} />
        </section>

        <section className="rounded-xl border bg-card p-6 shadow-xs">
          {accountId ? (
            <VoucherField
              accountId={accountId}
              subtotal={subtotal}
              applied={appliedVoucher}
              onApply={setAppliedVoucher}
              onRemove={() => setAppliedVoucher(null)}
            />
          ) : (
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium">Voucher</p>
              <Separator />
              <p className="text-sm text-muted-foreground">Sign in to apply a voucher.</p>
            </div>
          )}
        </section>
      </div>

      <aside className="lg:sticky lg:top-20 lg:self-start">
        <OrderSummary
          lines={lines}
          itemCount={itemCount}
          subtotal={subtotal}
          deliveryTierId={deliveryTierId}
          voucher={displayVoucher}
          total={total}
          pending={isPlacingOrder}
          disabled={!canPlaceOrder}
          onPlaceOrder={handlePlaceOrder}
        />
      </aside>
    </div>
  );
}
