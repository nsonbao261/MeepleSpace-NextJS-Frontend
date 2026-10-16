import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { buildCatalogHref } from "@/lib/catalog-params";
import type { CatalogFilters } from "@/types/catalog";

function buildRange(current: number, total: number): number[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  if (current <= 3) {
    return [1, 2, 3, 4, -1, total];
  }

  if (current >= total - 2) {
    return [1, -1, total - 3, total - 2, total - 1, total];
  }

  return [1, -1, current - 1, current, current + 1, -1, total];
}

export function CatalogPagination({
  filters,
  pageCount,
}: {
  filters: CatalogFilters;
  pageCount: number;
}) {
  const current = Math.min(Math.max(filters.page, 1), pageCount);

  if (pageCount <= 1) {
    return null;
  }

  const range = buildRange(current, pageCount);

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-between gap-4"
    >
      <div className="flex items-center gap-2 sm:hidden">
        {current > 1 ? (
          <Link
            href={buildCatalogHref({ ...filters, page: current - 1 })}
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            <ChevronLeftIcon className="size-4" />
            Previous
          </Link>
        ) : (
          <span
            className={buttonVariants({
              variant: "outline",
              size: "sm",
            })}
            aria-disabled="true"
          >
            <ChevronLeftIcon className="size-4" />
            Previous
          </span>
        )}
        {current < pageCount ? (
          <Link
            href={buildCatalogHref({ ...filters, page: current + 1 })}
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            Next
            <ChevronRightIcon className="size-4" />
          </Link>
        ) : (
          <span
            className={buttonVariants({
              variant: "outline",
              size: "sm",
            })}
            aria-disabled="true"
          >
            Next
            <ChevronRightIcon className="size-4" />
          </span>
        )}
      </div>

      <div className="hidden flex-wrap items-center gap-1 sm:flex">
        {current > 1 ? (
          <Link
            href={buildCatalogHref({ ...filters, page: current - 1 })}
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            <ChevronLeftIcon className="size-4" />
            Previous
          </Link>
        ) : (
          <span
            className={buttonVariants({
              variant: "outline",
              size: "sm",
            })}
            aria-disabled="true"
          >
            <ChevronLeftIcon className="size-4" />
            Previous
          </span>
        )}

        {range.map((page, index) => {
          if (page === -1) {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-2 text-sm text-muted-foreground"
              >
                …
              </span>
            );
          }

          const isActive = page === current;

          return isActive ? (
            <span
              key={page}
              aria-current="page"
              className={buttonVariants({
                size: "sm",
                variant: "default",
              })}
            >
              {page}
            </span>
          ) : (
            <Link
              key={page}
              href={buildCatalogHref({ ...filters, page })}
              className={buttonVariants({
                size: "sm",
                variant: "ghost",
              })}
            >
              {page}
            </Link>
          );
        })}

        {current < pageCount ? (
          <Link
            href={buildCatalogHref({ ...filters, page: current + 1 })}
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            Next
            <ChevronRightIcon className="size-4" />
          </Link>
        ) : (
          <span
            className={buttonVariants({
              variant: "outline",
              size: "sm",
            })}
            aria-disabled="true"
          >
            Next
            <ChevronRightIcon className="size-4" />
          </span>
        )}
      </div>
    </nav>
  );
}
