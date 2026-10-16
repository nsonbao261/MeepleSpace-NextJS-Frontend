"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";

import { buildCatalogHref, withCatalogFilters } from "@/lib/catalog-params";
import type { CatalogFilters } from "@/types/catalog";

export function useCatalogParams(filters: CatalogFilters) {
  const router = useRouter();

  const setFilters = useCallback(
    (patch: Partial<CatalogFilters>) => {
      router.replace(buildCatalogHref(withCatalogFilters(filters, patch)), {
        scroll: false,
      });
    },
    [filters, router],
  );

  return { filters, setFilters };
}
