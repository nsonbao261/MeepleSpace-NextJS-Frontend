import type { Metadata } from "next";

import { CheckoutView } from "@/components/checkout";

export const metadata: Metadata = {
  title: "Checkout | MeepleSpace",
  description: "Complete your order with delivery details and payment.",
};

export default function CheckoutPage() {
  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col gap-8">
        <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">Checkout</h1>
        <CheckoutView />
      </div>
    </div>
  );
}
