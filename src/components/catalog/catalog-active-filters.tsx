import Link from "next/link";
import { XIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  BADGE_OPTIONS,
  PLAYER_BUCKETS,
  PLAY_TIME_BUCKETS,
} from "@/constants/catalog-filters";
import { categoryLabel } from "@/constants/game-categories";
import {
  buildCatalogHref,
  countActiveFilters,
  withCatalogFilters,
} from "@/lib/catalog-params";
import { formatPrice } from "@/lib/format";
import type { CatalogFilters } from "@/types/catalog";

function formatRating(value: 3.5 | 4 | 4.5): string {
  return `${value.toFixed(1)}+`;
}

function formatAge(value: 6 | 8 | 10 | 12 | 14): string {
  return `${value}+`;
}

export function CatalogActiveFilters({ filters }: { filters: CatalogFilters }) {
  const activeCount = countActiveFilters(filters);

  if (activeCount === 0) {
    return null;
  }

  const chips: React.ReactNode[] = [];

  if (filters.q !== "") {
    const href = buildCatalogHref(withCatalogFilters(filters, { q: "" }));
    chips.push(
      <Badge key="q" variant="secondary" className="gap-1.5 pr-1">
        <span className="max-w-[200px] truncate">q: {filters.q}</span>
        <Link
          href={href}
          aria-label="Remove search filter"
          className="inline-flex size-4 items-center justify-center rounded-full text-muted-foreground hover:text-foreground"
        >
          <XIcon className="size-3" />
        </Link>
      </Badge>,
    );
  }

  for (const category of filters.categories) {
    const label = categoryLabel(category) ?? category;
    const next = filters.categories.filter((c) => c !== category);
    const href = buildCatalogHref(
      withCatalogFilters(filters, { categories: next }),
    );
    chips.push(
      <Badge
        key={`category-${category}`}
        variant="secondary"
        className="gap-1.5 pr-1"
      >
        <span>{label}</span>
        <Link
          href={href}
          aria-label={`Remove category ${label}`}
          className="inline-flex size-4 items-center justify-center rounded-full text-muted-foreground hover:text-foreground"
        >
          <XIcon className="size-3" />
        </Link>
      </Badge>,
    );
  }

  if (filters.publisher !== null) {
    const href = buildCatalogHref(
      withCatalogFilters(filters, { publisher: null }),
    );
    chips.push(
      <Badge key="publisher" variant="secondary" className="gap-1.5 pr-1">
        <span className="max-w-[200px] truncate">{filters.publisher}</span>
        <Link
          href={href}
          aria-label={`Remove publisher ${filters.publisher}`}
          className="inline-flex size-4 items-center justify-center rounded-full text-muted-foreground hover:text-foreground"
        >
          <XIcon className="size-3" />
        </Link>
      </Badge>,
    );
  }

  if (filters.priceMin !== null || filters.priceMax !== null) {
    const label =
      filters.priceMin !== null && filters.priceMax !== null
        ? `${formatPrice(filters.priceMin)} – ${formatPrice(filters.priceMax)}`
        : filters.priceMin !== null
          ? `Min ${formatPrice(filters.priceMin)}`
          : `Max ${formatPrice(filters.priceMax!)}`;
    const href = buildCatalogHref(
      withCatalogFilters(filters, { priceMin: null, priceMax: null }),
    );
    chips.push(
      <Badge key="price" variant="secondary" className="gap-1.5 pr-1">
        <span>{label}</span>
        <Link
          href={href}
          aria-label="Remove price filter"
          className="inline-flex size-4 items-center justify-center rounded-full text-muted-foreground hover:text-foreground"
        >
          <XIcon className="size-3" />
        </Link>
      </Badge>,
    );
  }

  if (filters.rating !== null) {
    const label = formatRating(filters.rating);
    const href = buildCatalogHref(
      withCatalogFilters(filters, { rating: null }),
    );
    chips.push(
      <Badge key="rating" variant="secondary" className="gap-1.5 pr-1">
        <span>{label}</span>
        <Link
          href={href}
          aria-label={`Remove rating ${label}`}
          className="inline-flex size-4 items-center justify-center rounded-full text-muted-foreground hover:text-foreground"
        >
          <XIcon className="size-3" />
        </Link>
      </Badge>,
    );
  }

  for (const player of filters.players) {
    const option = PLAYER_BUCKETS.find((b) => b.value === player);
    const label = option?.label ?? player;
    const next = filters.players.filter((p) => p !== player);
    const href = buildCatalogHref(
      withCatalogFilters(filters, { players: next }),
    );
    chips.push(
      <Badge
        key={`player-${player}`}
        variant="secondary"
        className="gap-1.5 pr-1"
      >
        <span>{label}</span>
        <Link
          href={href}
          aria-label={`Remove players ${label}`}
          className="inline-flex size-4 items-center justify-center rounded-full text-muted-foreground hover:text-foreground"
        >
          <XIcon className="size-3" />
        </Link>
      </Badge>,
    );
  }

  for (const time of filters.playTimes) {
    const option = PLAY_TIME_BUCKETS.find((b) => b.value === time);
    const label = option?.label ?? time;
    const next = filters.playTimes.filter((t) => t !== time);
    const href = buildCatalogHref(
      withCatalogFilters(filters, { playTimes: next }),
    );
    chips.push(
      <Badge key={`time-${time}`} variant="secondary" className="gap-1.5 pr-1">
        <span>{label}</span>
        <Link
          href={href}
          aria-label={`Remove play time ${label}`}
          className="inline-flex size-4 items-center justify-center rounded-full text-muted-foreground hover:text-foreground"
        >
          <XIcon className="size-3" />
        </Link>
      </Badge>,
    );
  }

  if (filters.ageMax !== null) {
    const label = formatAge(filters.ageMax);
    const href = buildCatalogHref(
      withCatalogFilters(filters, { ageMax: null }),
    );
    chips.push(
      <Badge key="age" variant="secondary" className="gap-1.5 pr-1">
        <span>{label}</span>
        <Link
          href={href}
          aria-label={`Remove age ${label}`}
          className="inline-flex size-4 items-center justify-center rounded-full text-muted-foreground hover:text-foreground"
        >
          <XIcon className="size-3" />
        </Link>
      </Badge>,
    );
  }

  for (const badge of filters.badges) {
    const option = BADGE_OPTIONS.find((b) => b.value === badge);
    const label = option?.label ?? badge;
    const next = filters.badges.filter((b) => b !== badge);
    const href = buildCatalogHref(
      withCatalogFilters(filters, { badges: next }),
    );
    chips.push(
      <Badge
        key={`badge-${badge}`}
        variant="secondary"
        className="gap-1.5 pr-1"
      >
        <span>{label}</span>
        <Link
          href={href}
          aria-label={`Remove badge ${label}`}
          className="inline-flex size-4 items-center justify-center rounded-full text-muted-foreground hover:text-foreground"
        >
          <XIcon className="size-3" />
        </Link>
      </Badge>,
    );
  }

  const clearAllHref = buildCatalogHref({
    ...filters,
    q: "",
    categories: [],
    publisher: null,
    priceMin: null,
    priceMax: null,
    rating: null,
    players: [],
    playTimes: [],
    ageMax: null,
    badges: [],
    page: 1,
  });

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips}
      <Link
        href={clearAllHref}
        className={buttonVariants({
          variant: "ghost",
          size: "xs",
        })}
      >
        Clear all
      </Link>
    </div>
  );
}
