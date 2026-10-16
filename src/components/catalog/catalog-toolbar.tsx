"use client";

import { countActiveFilters } from "@/lib/catalog-params";
import { formatNumber } from "@/lib/format";
import type {
  CatalogFilters,
  CategoryOption,
  FacetCounts,
  PriceBounds,
  PublisherOption,
} from "@/types/catalog";

import { CatalogSearch } from "./catalog-search";
import { CatalogSheet } from "./catalog-sheet";
import { CatalogSort } from "./catalog-sort";

interface CatalogToolbarProps {
  filters: CatalogFilters;
  priceBounds: PriceBounds;
  publishers: PublisherOption[];
  categories: CategoryOption[];
  facetCounts: FacetCounts;
  total: number;
}

export function CatalogToolbar({
  filters,
  priceBounds,
  publishers,
  categories,
  facetCounts,
  total,
}: CatalogToolbarProps) {
  const activeCount = countActiveFilters(filters);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2 md:flex-nowrap md:justify-between">
        <div className="w-full md:w-80">
          <CatalogSearch filters={filters} />
        </div>
        <div className="flex w-full items-center justify-between gap-2 md:w-auto md:justify-end">
          <CatalogSort filters={filters} />
          <CatalogSheet
            filters={filters}
            priceBounds={priceBounds}
            publishers={publishers}
            categories={categories}
            facetCounts={facetCounts}
            total={total}
          />
        </div>
      </div>
      {activeCount > 0 && (
        <p className="text-sm text-muted-foreground tabular-nums">
          {formatNumber(total)} games
        </p>
      )}
    </div>
  );
}
