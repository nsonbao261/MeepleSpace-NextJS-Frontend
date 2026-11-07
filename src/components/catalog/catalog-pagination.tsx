"use client";

import { parseAsInteger, useQueryState } from "nuqs";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

interface CatalogPaginationProps {
  totalItems: number;
  pageSize: number;
  gridElementId?: string;
}

export function CatalogPagination({
  totalItems,
  pageSize,
  gridElementId = "catalog-product-grid",
}: CatalogPaginationProps) {
  const [page, setPage] = useQueryState("page", parseAsInteger);

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const rawPage = page ?? 1;
  const currentPage = Math.min(Math.max(1, rawPage), totalPages);

  if (totalPages <= 1) {
    return null;
  }

  const navigateToPage = (newPage: number) => {
    const clamped = Math.min(Math.max(1, newPage), totalPages);
    if (clamped === 1) {
      setPage(null);
    } else {
      setPage(clamped);
    }

    const gridEl = document.getElementById(gridElementId);
    if (gridEl) {
      gridEl.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <nav className="flex items-center justify-center gap-1.5 py-6" aria-label="Pagination">
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="size-9"
        onClick={() => navigateToPage(currentPage - 1)}
        disabled={currentPage <= 1}
        aria-label="Previous page"
      >
        <ChevronLeftIcon className="size-4" />
      </Button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
        const isActive = p === currentPage;
        return (
          <Button
            key={p}
            type="button"
            variant={isActive ? "default" : "outline"}
            size="icon"
            className="size-9 text-sm"
            onClick={() => navigateToPage(p)}
            aria-current={isActive ? "page" : undefined}
            aria-label={`Page ${p}`}
          >
            {p}
          </Button>
        );
      })}

      <Button
        type="button"
        variant="outline"
        size="icon"
        className="size-9"
        onClick={() => navigateToPage(currentPage + 1)}
        disabled={currentPage >= totalPages}
        aria-label="Next page"
      >
        <ChevronRightIcon className="size-4" />
      </Button>
    </nav>
  );
}
