import Link from "next/link";

import { BookCard } from "@/components/product/book-card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { buttonVariants } from "@/components/ui/button";
import { buildCatalogHref } from "@/lib/catalog-params";
import type { CatalogFilters } from "@/types/catalog";
import type { MerchandisingFlags } from "@/types/catalog";

import type { Game } from "@/types/game";

interface CatalogResultsProps {
  filters: CatalogFilters;
  games: Game[];
  flags: MerchandisingFlags;
  total: number;
}

export function CatalogResults({
  filters,
  games,
  flags,
  total,
}: CatalogResultsProps) {
  if (total === 0) {
    const clearHref = buildCatalogHref({
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
      <Empty className="border">
        <EmptyHeader>
          <EmptyTitle>No games match these filters</EmptyTitle>
          <EmptyDescription>
            Try adjusting your filters or start fresh to see the full catalog.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Link href={clearHref} className={buttonVariants({ size: "sm" })}>
            Clear all filters
          </Link>
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {games.map((game) => (
        <BookCard
          key={game.id}
          game={game}
          flags={{
            isBestSeller: flags.bestSellerIds.has(game.id),
            isNew: flags.newIds.has(game.id),
          }}
          showWishlist
          sizes="(max-width: 639px) 85vw, (max-width: 1023px) 46vw, (max-width: 1279px) 31vw, 24vw"
        />
      ))}
    </div>
  );
}
