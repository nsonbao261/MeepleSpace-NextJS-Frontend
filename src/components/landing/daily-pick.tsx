"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useState } from "react";

import { ProductCard } from "@/components/product";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types";

interface DailyPickProps {
  products: Product[];
}

/** Wide feature section paging the day's picks one card at a time. */
export function DailyPick({ products }: DailyPickProps) {
  const [index, setIndex] = useState(0);
  if (products.length === 0) return null;

  const last = products.length - 1;
  const paged = products.length > 1;

  return (
    <section aria-labelledby="daily-pick-heading" className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <h2 id="daily-pick-heading" className="font-display text-3xl md:text-4xl">
            Daily pick
          </h2>
          <p className="mt-2 text-sm text-muted-foreground md:text-base">
            Up to four games hand-picked for today, refreshed from our curated favourites.
          </p>
        </div>
        {paged && (
          <div className="ml-auto flex shrink-0 items-center gap-3">
            <span aria-hidden="true" className="text-sm text-muted-foreground tabular-nums">
              {index + 1} / {products.length}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                aria-label="Previous pick"
                disabled={index === 0}
                onClick={() => setIndex((i) => i - 1)}
                className="size-11 md:size-9"
              >
                <ChevronLeftIcon aria-hidden="true" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                aria-label="Next pick"
                disabled={index === last}
                onClick={() => setIndex((i) => i + 1)}
                className="size-11 md:size-9"
              >
                <ChevronRightIcon aria-hidden="true" />
              </Button>
            </div>
          </div>
        )}
        {paged && (
          <span aria-live="polite" className="sr-only">
            Pick {index + 1} of {products.length}
          </span>
        )}
      </div>
      <ProductCard key={products[index].id} product={products[index]} variant="feature" />
    </section>
  );
}
