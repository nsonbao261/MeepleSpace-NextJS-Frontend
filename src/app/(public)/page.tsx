import type { Metadata } from "next";

import { DailyPick, Hero, ProductRail, TrustStrip } from "@/components";
import { getBestSellersCached, getDailyPickCached, getNewArrivalsCached } from "@/services";

export const metadata: Metadata = {
  title: "MeepleSpace — Board games, venues and price comparison",
  description:
    "Find your next game night: shop board games at Vietnamese-market prices, discover venues, and compare deals.",
};

/** Public landing: hero, trust signals, daily pick and two cached product rails. */
export default async function Home() {
  const [dailyPick, bestSellers, newArrivals] = await Promise.all([
    getDailyPickCached(),
    getBestSellersCached(),
    getNewArrivalsCached(),
  ]);

  return (
    <>
      <Hero />
      <TrustStrip />
      {dailyPick && <DailyPick product={dailyPick} />}
      <ProductRail title="Best sellers" products={bestSellers} />
      <ProductRail title="New arrivals" products={newArrivals} />
    </>
  );
}
