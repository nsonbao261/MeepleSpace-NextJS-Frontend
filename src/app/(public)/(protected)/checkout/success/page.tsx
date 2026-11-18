import type { Metadata } from "next";

import { CheckoutSuccess } from "@/components/checkout";

export const metadata: Metadata = {
  title: "Payment successful | MeepleSpace",
  description: "Your MeepleSpace order has been paid.",
};

interface CheckoutSuccessPageProps {
  searchParams: Promise<{ order?: string }>;
}

export default async function CheckoutSuccessPage({ searchParams }: CheckoutSuccessPageProps) {
  const { order } = await searchParams;

  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col gap-8">
        <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          Payment successful
        </h1>
        <CheckoutSuccess orderCode={order ?? ""} />
      </div>
    </div>
  );
}
