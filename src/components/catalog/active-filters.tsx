"use client";

import { parseAsArrayOf, parseAsInteger, parseAsString, useQueryState, useQueryStates } from "nuqs";
import { XIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BADGE_OPTIONS, GENRE_OPTIONS, PRICE_BUCKETS, PUBLISHER_OPTIONS } from "@/constants";

interface AppliedFilters {
  badge?: string[] | null;
  genre?: string[] | null;
  publisher?: string | null;
  price?: string | null;
}

const badgeLabels = new Map<string, string>(BADGE_OPTIONS.map((b) => [b.value, b.label]));
const genreLabels = new Map<string, string>(GENRE_OPTIONS.map((g) => [g.value, g.label]));
const priceLabels = new Map<string, string>(PRICE_BUCKETS.map((p) => [p.value, p.label]));
const publishers = new Set<string>(PUBLISHER_OPTIONS);

/** Counts only known, unique values; whitespace-only searches are ignored. */
export function countActiveFilters(q: string | null, filters: AppliedFilters): number {
  const badges = new Set((filters.badge ?? []).filter((value) => badgeLabels.has(value)));
  const genres = new Set((filters.genre ?? []).filter((value) => genreLabels.has(value)));
  return (
    (q && q.trim().length > 0 ? 1 : 0) +
    badges.size +
    genres.size +
    (filters.publisher && publishers.has(filters.publisher) ? 1 : 0) +
    (filters.price && priceLabels.has(filters.price) ? 1 : 0)
  );
}

export function ActiveFilters() {
  const [q, setQ] = useQueryState("q");
  const [, setPage] = useQueryState("page", parseAsInteger);

  const [appliedFilters, setAppliedFilters] = useQueryStates({
    badge: parseAsArrayOf(parseAsString),
    genre: parseAsArrayOf(parseAsString),
    publisher: parseAsString,
    price: parseAsString,
  });

  const activeChips: { key: string; value: string; label: string }[] = [];
  const trimmedQ = q?.trim() ?? "";

  if (trimmedQ.length > 0) {
    activeChips.push({
      key: "q",
      value: trimmedQ,
      label: `Search: "${trimmedQ}"`,
    });
  }

  for (const b of new Set(appliedFilters.badge ?? [])) {
    if (badgeLabels.has(b)) {
      activeChips.push({ key: "badge", value: b, label: badgeLabels.get(b)! });
    }
  }

  for (const g of new Set(appliedFilters.genre ?? [])) {
    if (genreLabels.has(g)) {
      activeChips.push({ key: "genre", value: g, label: genreLabels.get(g)! });
    }
  }

  if (appliedFilters.publisher && publishers.has(appliedFilters.publisher)) {
    activeChips.push({
      key: "publisher",
      value: appliedFilters.publisher,
      label: appliedFilters.publisher,
    });
  }

  if (appliedFilters.price && priceLabels.has(appliedFilters.price)) {
    activeChips.push({
      key: "price",
      value: appliedFilters.price,
      label: priceLabels.get(appliedFilters.price)!,
    });
  }

  if (activeChips.length === 0) {
    return null;
  }

  const removeChip = (key: string, value: string) => {
    setPage(null);
    if (key === "q") {
      setQ(null);
    } else if (key === "badge") {
      const remaining = new Set(appliedFilters.badge ?? []);
      remaining.delete(value);
      setAppliedFilters({ badge: remaining.size > 0 ? [...remaining] : null });
    } else if (key === "genre") {
      const remaining = new Set(appliedFilters.genre ?? []);
      remaining.delete(value);
      setAppliedFilters({ genre: remaining.size > 0 ? [...remaining] : null });
    } else if (key === "publisher") {
      setAppliedFilters({ publisher: null });
    } else if (key === "price") {
      setAppliedFilters({ price: null });
    }
  };

  const clearAll = () => {
    setQ(null);
    setAppliedFilters({
      badge: null,
      genre: null,
      publisher: null,
      price: null,
    });
    setPage(null);
  };

  return (
    <div
      role="group"
      className="flex flex-wrap items-center gap-2 pt-1"
      aria-label="Active filters"
    >
      <span className="text-xs text-muted-foreground">Active filters:</span>
      {activeChips.map((chip) => (
        <Badge
          key={`${chip.key}-${chip.value}`}
          variant="secondary"
          className="inline-flex max-w-72 items-center gap-1 pr-1 pl-2.5 text-xs font-normal"
        >
          <span className="truncate" title={chip.label}>
            {chip.label}
          </span>
          <button
            type="button"
            onClick={() => removeChip(chip.key, chip.value)}
            className="shrink-0 rounded-full p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label={`Remove filter ${chip.label}`}
          >
            <XIcon className="size-3" />
          </button>
        </Badge>
      ))}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={clearAll}
        className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
      >
        Clear all
      </Button>
    </div>
  );
}
