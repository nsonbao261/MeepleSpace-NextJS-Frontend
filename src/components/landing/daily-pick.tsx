import { ProductCard } from "@/components/product";
import type { Product } from "@/types";

interface DailyPickProps {
  product: Product;
}

/** Wide feature section for the rotating pick; the card carries the actions. */
export function DailyPick({ product }: DailyPickProps) {
  return (
    <section aria-labelledby="daily-pick-heading" className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <div className="mb-5 max-w-2xl">
        <h2 id="daily-pick-heading" className="font-display text-3xl md:text-4xl">
          Daily pick
        </h2>
        <p className="mt-2 text-sm text-muted-foreground md:text-base">
          One game hand-picked for today, refreshed from our curated favourites.
        </p>
      </div>
      <ProductCard product={product} variant="feature" />
    </section>
  );
}
