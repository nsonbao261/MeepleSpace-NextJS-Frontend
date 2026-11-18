import type { Metadata } from "next";

import { PaymentGateway } from "@/components/checkout";

export const metadata: Metadata = {
  title: "Payment | MeepleSpace",
  description: "Complete your order in the sandbox payment gateway.",
};

interface CheckoutPayPageProps {
  searchParams: Promise<{ order?: string }>;
}

export default async function CheckoutPayPage({ searchParams }: CheckoutPayPageProps) {
  const { order } = await searchParams;

  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col gap-8">
        <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">Payment</h1>
        <PaymentGateway orderCode={order ?? ""} />
      </div>
    </div>
  );
}
