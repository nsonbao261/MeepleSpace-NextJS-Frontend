import type { Metadata } from "next";

import { DailyPick, Hero, ProductRail, TrustStrip } from "@/components";
import { getBestSellersCached, getDailyPicksCached, getNewArrivalsCached } from "@/services";

export const metadata: Metadata = {
  title: "MeepleSpace — Board games, venues and price comparison",
  description:
    "Find your next game night: shop board games at Vietnamese-market prices, discover venues, and compare deals.",
};

/** Public landing: hero, trust signals, daily picks and one tabbed product rail. */
export default async function Home() {
  const [dailyPicks, bestSellers, newArrivals] = await Promise.all([
    getDailyPicksCached(),
    getBestSellersCached(),
    getNewArrivalsCached(),
  ]);

  return (
    <>
      <Hero />
      <TrustStrip />
      {dailyPicks.length > 0 && <DailyPick products={dailyPicks} />}
      <ProductRail bestSellers={bestSellers} newArrivals={newArrivals} />
    </>
  );
}
