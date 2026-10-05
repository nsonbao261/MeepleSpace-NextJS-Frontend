import { HeroBanner } from "@/components/hero/hero-banner";
import { ProductRail } from "@/components/product/product-rail";
import {
  getBestSellers,
  getMerchandisingFlags,
  getNewArrivals,
  getOnSale,
} from "@/lib/queries";

export default function Home() {
  const flags = getMerchandisingFlags();

  return (
    <>
      <HeroBanner />

      {}
      {}
      <div id="catalog" className="scroll-mt-20">
        <ProductRail
          id="new-arrivals"
          title="New Arrivals"
          subline="Fresh on the shelves"
          games={getNewArrivals()}
          flags={flags}
        />

        <ProductRail
          id="best-sellers"
          title="Best Sellers"
          subline="What the table keeps coming back to"
          games={getBestSellers()}
          flags={flags}
        />

        <ProductRail
          id="on-sale"
          title="On Sale"
          subline="Limited time, while stocks last"
          games={getOnSale()}
          flags={flags}
        />
      </div>
    </>
  );
}
