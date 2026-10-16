"use client";

import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SORT_DEFAULT_DIR, SORT_OPTIONS } from "@/constants/catalog-filters";
import type { CatalogFilters } from "@/types/catalog";
import type { SortKey } from "@/types/catalog";

import { useCatalogParams } from "./use-catalog-params";

export function CatalogSort({ filters }: { filters: CatalogFilters }) {
  const { setFilters } = useCatalogParams(filters);

  function handleSortChange(value: string) {
    if (value === filters.sort) {
      return;
    }

    const nextSort = value as SortKey;
    setFilters({ sort: nextSort, dir: SORT_DEFAULT_DIR[nextSort] });
  }

  function handleDirectionToggle() {
    const nextDir = filters.dir === "asc" ? "desc" : "asc";
    setFilters({ dir: nextDir });
  }

  const directionLabel =
    filters.dir === "asc"
      ? `Sort direction: ascending for ${filters.sort}`
      : `Sort direction: descending for ${filters.sort}`;

  return (
    <div className="flex items-center gap-2">
      <Select
        value={filters.sort}
        onValueChange={(value) =>
          handleSortChange(String(value ?? filters.sort))
        }
      >
        <SelectTrigger size="sm">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        size="icon-sm"
        variant="outline"
        onClick={handleDirectionToggle}
        aria-label={directionLabel}
      >
        {filters.dir === "asc" ? (
          <ArrowUpIcon className="size-4" />
        ) : (
          <ArrowDownIcon className="size-4" />
        )}
      </Button>
    </div>
  );
}
