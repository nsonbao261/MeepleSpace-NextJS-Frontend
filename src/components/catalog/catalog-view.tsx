"use client";

import { useEffect, useState } from "react";
import { parseAsArrayOf, parseAsInteger, parseAsString, useQueryState, useQueryStates } from "nuqs";
import { SlidersHorizontalIcon } from "lucide-react";

import { ActiveFilters, countActiveFilters } from "@/components/catalog/active-filters";
import { CatalogFilters } from "@/components/catalog/catalog-filters";
import { CatalogPagination } from "@/components/catalog/catalog-pagination";
import { CatalogSort } from "@/components/catalog/catalog-sort";
import { ProductCard } from "@/components/product/product-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CATALOG_PAGE_SIZE } from "@/constants";
import type { Product } from "@/types";

interface CatalogViewProps {
  products: Product[];
}

export function CatalogView({ products }: CatalogViewProps) {
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const [q, setQ] = useQueryState("q");
  const [page, setPage] = useQueryState("page", parseAsInteger);

  const [appliedFilters] = useQueryStates({
    badge: parseAsArrayOf(parseAsString),
    genre: parseAsArrayOf(parseAsString),
    publisher: parseAsString,
    price: parseAsString,
  });

  const totalItems = products.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / CATALOG_PAGE_SIZE));
  const currentPage = Math.min(Math.max(1, page ?? 1), totalPages);

  // Drop a whitespace-only search from the URL (it is not a real filter).
  useEffect(() => {
    if (q !== null && q.trim().length === 0) {
      void setQ(null);
    }
  }, [q, setQ]);

  // Clamp an out-of-range page in the URL to the last available page.
  useEffect(() => {
    if (page !== null && page !== currentPage) {
      void setPage(currentPage === 1 ? null : currentPage);
    }
  }, [page, currentPage, setPage]);

  const filterKey = `${q}-${JSON.stringify(appliedFilters)}`;
  const activeCount = countActiveFilters(q, appliedFilters);

  // The grid is fixed: page 1 shows twelve products, page 2 shows the remainder.
  const startIndex = (currentPage - 1) * CATALOG_PAGE_SIZE;
  const endIndex = Math.min(startIndex + CATALOG_PAGE_SIZE, totalItems);
  const currentProducts = products.slice(startIndex, endIndex);

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
      {/* Desktop Filter Sidebar */}
      <aside
        className="hidden w-64 shrink-0 rounded-xl border bg-card p-5 lg:block"
        aria-label="Product filters"
      >
        <h2 className="mb-4 text-base font-semibold text-foreground">Filters</h2>
        <CatalogFilters key={filterKey} />
      </aside>

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1 flex-col gap-5">
        {/* Top Control Bar: Mobile Filter Button, Result Count, Sort */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile Filter Sheet */}
            <div className="lg:hidden">
              <Sheet open={mobileFilterOpen} onOpenChange={setMobileFilterOpen}>
                <SheetTrigger
                  render={
                    <Button
                      variant="outline"
                      size="sm"
                      className="relative flex items-center gap-2"
                    />
                  }
                >
                  <SlidersHorizontalIcon className="size-4" />
                  <span>Filters</span>
                  {activeCount > 0 && (
                    <Badge
                      variant="default"
                      className="size-5 rounded-full p-0 text-[11px] leading-none"
                    >
                      {activeCount}
                    </Badge>
                  )}
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] overflow-y-auto p-6 sm:w-[360px]">
                  <SheetHeader className="mb-4 p-0">
                    <SheetTitle>Filters</SheetTitle>
                    <SheetDescription>Refine your board game catalog search</SheetDescription>
                  </SheetHeader>
                  <CatalogFilters key={filterKey} onApply={() => setMobileFilterOpen(false)} />
                </SheetContent>
              </Sheet>
            </div>

            <p className="text-sm text-muted-foreground">
              Showing{" "}
              <span className="font-medium text-foreground">
                {totalItems > 0 ? startIndex + 1 : 0}–{endIndex}
              </span>{" "}
              of <span className="font-medium text-foreground">{totalItems}</span> games
            </p>
          </div>

          <CatalogSort />
        </div>

        {/* Active Filter Chips */}
        <ActiveFilters />

        {/* Product Grid */}
        <section id="catalog-product-grid" aria-label="Product Catalog">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {currentProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Pagination */}
        <CatalogPagination totalItems={totalItems} pageSize={CATALOG_PAGE_SIZE} />
      </div>
    </div>
  );
}
