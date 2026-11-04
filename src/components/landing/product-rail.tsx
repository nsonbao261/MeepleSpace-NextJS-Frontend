import Link from "next/link";

import { ProductCard } from "@/components/product";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import type { Product } from "@/types";

interface ProductRailProps {
  title: string;
  products: Product[];
}

/** Serif heading with a keyboard-scrollable row of cards; keeps heading on empty. */
export function ProductRail({ title, products }: ProductRailProps) {
  const empty = products.length === 0;
  const headingId = `rail-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  return (
    <section aria-labelledby={headingId} className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <div className="mb-5 flex items-end justify-between gap-4">
        <h2 id={headingId} className="font-display text-3xl md:text-4xl">
          {title}
        </h2>
        {!empty && (
          <Link
            href="/products"
            className="text-sm font-medium text-primary hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            View all
          </Link>
        )}
      </div>

      {empty ? (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>No games here yet</EmptyTitle>
            <EmptyDescription>
              This shelf is waiting to be restocked. Check back soon or browse the full catalogue.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div
          role="region"
          aria-labelledby={headingId}
          tabIndex={0}
          className="flex gap-4 overflow-x-auto pb-2 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none motion-safe:snap-x"
        >
          <ul className="flex gap-4">
            {products.map((product) => (
              <li
                key={product.id}
                className="w-[70%] max-w-[17rem] shrink-0 motion-safe:snap-start sm:w-52 md:w-56"
              >
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
