import { HeroBanner } from "@/components/hero/hero-banner";
import { ProductRail } from "@/components/product/product-rail";
import {
  getBestSellers,
  getMerchandisingFlags,
  getNewArrivals,
  getOnSale,
} from "@/lib/queries";

/**
 * Landing page. Server component: the hero and all three rails render on the
 * server, so the catalog is in the HTML with no JavaScript. The only client
 * components on the page are the three `CarouselViewport`s (plus the vendored
 * carousel, tooltip and Sheet they pull in).
 *
 * `getMerchandisingFlags()` is called exactly once here and threaded through
 * all three rails. Computing the badge sets per card would rescan the catalog
 * 24 times over (plan amendment A-5).
 *
 * Rails overlap by design: a best-selling game being on sale is normal retail,
 * not a data error, so no cross-rail de-duplication is attempted.
 */
export default function Home() {
  const flags = getMerchandisingFlags();

  return (
    <>
      <HeroBanner />

      {/* No <main> here: the `(public)` group layout already renders one around
          this slot, and a document may only have a single non-hidden <main>. */}
      {/* `id="catalog"` is the target for the `Catalog` links in the navbar,
          footer, and hero. A real `/catalog` is F-2 in the spec's follow-ups;
          until that route exists this is the honest in-page destination, which
          is what Decision 2 asks for. `scroll-mt-20` matches the rails below so
          the jump clears the sticky h-16 header. */}
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
