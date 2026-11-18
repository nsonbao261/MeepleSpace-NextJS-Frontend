"use client";

import { ShoppingCartIcon } from "lucide-react";

import { useCartStore } from "@/store";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { ButtonLink } from "@/components/common/button-link";
import { CartLineItem } from "./cart-line-item";
import { CartSummary } from "./cart-summary";

export function CartView() {
  const lines = useCartStore((state) => state.lines);
  const itemCount = useCartStore((state) => state.itemCount);

  if (itemCount === 0) {
    return (
      <Empty className="py-16">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <ShoppingCartIcon className="size-6 text-muted-foreground" />
          </EmptyMedia>
          <EmptyTitle>Your cart is empty</EmptyTitle>
          <EmptyDescription>
            Discover our collection of board games and expansions to start your journey.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <ButtonLink href="/products" size="lg" className="w-full sm:w-auto">
            Explore Products
          </ButtonLink>
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
      <div className="flex flex-col divide-y rounded-xl border bg-card px-6 shadow-xs">
        {lines.map((item) => (
          <CartLineItem key={item.id} item={item} />
        ))}
      </div>
      <div>
        <div className="sticky top-20">
          <CartSummary />
        </div>
      </div>
    </div>
  );
}
