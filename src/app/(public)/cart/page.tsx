import type { Metadata } from "next";

import { CartView } from "@/components/cart";

export const metadata: Metadata = {
  title: "Cart | MeepleSpace",
  description: "View and manage your board game cart.",
};

export default function CartPage() {
  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Shopping Cart
          </h1>
          <p className="text-muted-foreground">
            Review your selected board games and expansions before checkout.
          </p>
        </div>
        <CartView />
      </div>
    </div>
  );
}
