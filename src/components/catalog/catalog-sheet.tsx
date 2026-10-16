"use client";

import { useState } from "react";
import { SlidersHorizontalIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { countActiveFilters } from "@/lib/catalog-params";
import { formatNumber } from "@/lib/format";
import type {
  CatalogFilters,
  CategoryOption,
  FacetCounts,
  PriceBounds,
  PublisherOption,
} from "@/types/catalog";

import { CatalogFacets } from "./catalog-facets";

interface CatalogSheetProps {
  filters: CatalogFilters;
  priceBounds: PriceBounds;
  publishers: PublisherOption[];
  categories: CategoryOption[];
  facetCounts: FacetCounts;
  total: number;
}

export function CatalogSheet({
  filters,
  priceBounds,
  publishers,
  categories,
  facetCounts,
  total,
}: CatalogSheetProps) {
  const [open, setOpen] = useState(false);
  const activeCount = countActiveFilters(filters);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={<Button variant="outline" size="sm" className="lg:hidden" />}
      >
        <SlidersHorizontalIcon className="size-4" />
        Filters
        {activeCount > 0 && <Badge variant="secondary">{activeCount}</Badge>}
      </SheetTrigger>
      <SheetContent side="left" className="gap-0">
        <SheetHeader className="p-4">
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription className="sr-only">
            Filter the catalog
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-4">
          <CatalogFacets
            variant="sheet"
            filters={filters}
            priceBounds={priceBounds}
            publishers={publishers}
            categories={categories}
            facetCounts={facetCounts}
          />
        </div>
        <SheetFooter className="border-t border-border p-4">
          <p className="text-sm text-muted-foreground tabular-nums">
            {formatNumber(total)} games
          </p>
          <Button className="w-full" onClick={() => setOpen(false)}>
            Show {formatNumber(total)} games
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
