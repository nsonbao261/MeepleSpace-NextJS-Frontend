"use client";

import { parseAsString, useQueryState } from "nuqs";
import { ArrowDownWideNarrowIcon, ArrowUpNarrowWideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SORT_OPTIONS } from "@/constants";

const sortValues = new Set<string>(SORT_OPTIONS.map((option) => option.value));

export function CatalogSort() {
  const [sort, setSort] = useQueryState("sort", parseAsString.withDefault("popularity"));
  const [dir, setDir] = useQueryState("dir", parseAsString.withDefault("asc"));

  // Unknown values are ignored rather than surfaced in the control.
  const currentSort = sortValues.has(sort) ? sort : "popularity";
  const showDirectionToggle = currentSort === "price" || currentSort === "rating";
  const currentDir = dir === "desc" ? "desc" : "asc";

  const handleSortChange = (newSort: string | null) => {
    if (!newSort || newSort === "popularity") {
      setSort(null);
      setDir(null);
    } else {
      setSort(newSort);
      if (newSort !== "price" && newSort !== "rating") {
        setDir(null);
      }
    }
  };

  const toggleDirection = () => {
    setDir(currentDir === "asc" ? "desc" : "asc");
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm whitespace-nowrap text-muted-foreground">Sort by:</span>
      <Select value={currentSort} onValueChange={handleSortChange}>
        <SelectTrigger className="w-[160px] sm:w-[180px]" aria-label="Sort by">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent align="end">
          {SORT_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {showDirectionToggle && (
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={toggleDirection}
          className="size-9 shrink-0"
          title={
            currentDir === "asc"
              ? "Ascending (click for descending)"
              : "Descending (click for ascending)"
          }
          aria-label={currentDir === "asc" ? "Sort ascending" : "Sort descending"}
        >
          {currentDir === "asc" ? (
            <ArrowUpNarrowWideIcon className="size-4" />
          ) : (
            <ArrowDownWideNarrowIcon className="size-4" />
          )}
        </Button>
      )}
    </div>
  );
}
