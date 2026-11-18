import type { Metadata } from "next";

import { CheckoutFailed } from "@/components/checkout";

export const metadata: Metadata = {
  title: "Payment failed | MeepleSpace",
  description: "Your MeepleSpace payment was not completed.",
};

interface CheckoutFailedPageProps {
  searchParams: Promise<{ order?: string }>;
}

export default async function CheckoutFailedPage({ searchParams }: CheckoutFailedPageProps) {
  const { order } = await searchParams;

  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col gap-8">
        <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          Payment failed
        </h1>
        <CheckoutFailed orderCode={order ?? ""} />
      </div>
    </div>
  );
}
