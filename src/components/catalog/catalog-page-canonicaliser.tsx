"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { buildCatalogHref } from "@/lib/catalog-params";
import type { CatalogFilters } from "@/types/catalog";

export function CatalogPageCanonicaliser({
  filters,
  requested,
  clamped,
}: {
  filters: CatalogFilters;
  requested: number;
  clamped: number;
}) {
  const router = useRouter();

  useEffect(() => {
    if (requested !== clamped) {
      router.replace(buildCatalogHref({ ...filters, page: clamped }), {
        scroll: false,
      });
    }
  }, [requested, clamped, filters, router]);

  return null;
}
