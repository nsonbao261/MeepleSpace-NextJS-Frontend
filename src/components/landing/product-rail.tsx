"use client";

import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { ProductCard } from "@/components/product";
import { Button } from "@/components/ui/button";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Product } from "@/types";

interface ProductRailProps {
  bestSellers: Product[];
  newArrivals: Product[];
}

type RailTab = "best-sellers" | "new-arrivals";

const ROW_CLASS =
  "flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none motion-safe:snap-x motion-safe:scroll-smooth";

/** Tabbed rail with serif tab headings; arrows page a scrollbar-free card row. */
export function ProductRail({ bestSellers, newArrivals }: ProductRailProps) {
  const [tab, setTab] = useState<RailTab>("best-sellers");
  const [edges, setEdges] = useState({ start: false, end: false });
  const bestRef = useRef<HTMLDivElement>(null);
  const arrivalsRef = useRef<HTMLDivElement>(null);

  const updateEdges = useCallback((el: HTMLDivElement | null) => {
    let start = false;
    let end = false;
    if (el) {
      const canScroll = el.scrollWidth - el.clientWidth > 1;
      start = canScroll && el.scrollLeft > 1;
      end = canScroll && el.scrollLeft + el.clientWidth < el.scrollWidth - 1;
    }
    setEdges((prev) => (prev.start === start && prev.end === end ? prev : { start, end }));
  }, []);

  // Re-measure when the visible tab changes or its width changes.
  useEffect(() => {
    const el = tab === "best-sellers" ? bestRef.current : arrivalsRef.current;
    updateEdges(el);
    if (!el) return;
    const observer = new ResizeObserver(() => updateEdges(el));
    observer.observe(el);
    return () => observer.disconnect();
  }, [tab, updateEdges]);

  const scrollRail = (direction: -1 | 1) => {
    const el = tab === "best-sellers" ? bestRef.current : arrivalsRef.current;
    el?.scrollBy({ left: direction * el.clientWidth * 0.8 });
  };

  const renderCards = (items: Product[]) => (
    <ul className="flex gap-4">
      {items.map((product) => (
        <li
          key={product.id}
          className="w-[70%] max-w-[17rem] shrink-0 motion-safe:snap-start sm:w-52 md:w-56"
        >
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );

  const renderEmpty = () => (
    <Empty>
      <EmptyHeader>
        <EmptyTitle>No games here yet</EmptyTitle>
        <EmptyDescription>
          This shelf is waiting to be restocked. Check back soon or browse the full catalogue.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );

  return (
    <section aria-labelledby="product-rail-tabs" className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <Tabs value={tab} onValueChange={(value) => setTab(value as RailTab)} className="gap-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <TabsList
            id="product-rail-tabs"
            variant="line"
            className="h-auto flex-wrap gap-4 bg-transparent p-0"
          >
            <TabsTrigger
              value="best-sellers"
              className="h-auto px-0 pb-1 font-display text-2xl font-normal sm:text-3xl md:text-4xl"
            >
              Best sellers
            </TabsTrigger>
            <TabsTrigger
              value="new-arrivals"
              className="h-auto px-0 pb-1 font-display text-2xl font-normal sm:text-3xl md:text-4xl"
            >
              New arrivals
            </TabsTrigger>
          </TabsList>
          <div className="ml-auto flex shrink-0 items-center gap-3">
            <Link
              href="/products"
              className="text-sm font-medium text-primary hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              View all
            </Link>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                aria-label="Scroll left"
                disabled={!edges.start}
                onClick={() => scrollRail(-1)}
                className="size-11 md:size-9"
              >
                <ChevronLeftIcon aria-hidden="true" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                aria-label="Scroll right"
                disabled={!edges.end}
                onClick={() => scrollRail(1)}
                className="size-11 md:size-9"
              >
                <ChevronRightIcon aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>
        <TabsContent value="best-sellers">
          {bestSellers.length === 0 ? (
            renderEmpty()
          ) : (
            <div
              ref={bestRef}
              role="region"
              aria-label="Best sellers"
              tabIndex={0}
              onScroll={(event) => updateEdges(event.currentTarget)}
              className={ROW_CLASS}
            >
              {renderCards(bestSellers)}
            </div>
          )}
        </TabsContent>
        <TabsContent value="new-arrivals">
          {newArrivals.length === 0 ? (
            renderEmpty()
          ) : (
            <div
              ref={arrivalsRef}
              role="region"
              aria-label="New arrivals"
              tabIndex={0}
              onScroll={(event) => updateEdges(event.currentTarget)}
              className={ROW_CLASS}
            >
              {renderCards(newArrivals)}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </section>
  );
}
