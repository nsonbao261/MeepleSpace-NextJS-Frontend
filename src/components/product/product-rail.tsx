import { BookCard } from "@/components/product/book-card";
import { CarouselViewport } from "@/components/product/carousel-viewport";
import { SectionHeading } from "@/components/product/section-heading";
import { buttonVariants } from "@/components/ui/button";
import {
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import type { Game } from "@/types/game";

const FULL_RAIL_SIZE = 8;

export type MerchandisingFlags = {
  newIds: Set<string>;
  bestSellerIds: Set<string>;
};

export function ProductRail({
  title,
  subline,
  id,
  games,
  flags,
}: {
  title: string;
  subline: string;
  id: string;
  games: Game[];
  flags: MerchandisingFlags;
}) {
  const showArrows = games.length >= FULL_RAIL_SIZE;

  const heading = (
    <SectionHeading
      id={`${id}-heading`}
      title={title}
      subline={subline}
      viewAllHref="#"
    />
  );

  if (games.length === 0) {
    return (
      <section
        id={id}
        aria-labelledby={`${id}-heading`}
        className="mx-auto w-full max-w-7xl scroll-mt-20 px-4 py-8 md:px-6"
      >
        {heading}

        <Empty className="border">
          <EmptyHeader>
            <EmptyTitle>Nothing here yet</EmptyTitle>
            <EmptyDescription>
              This shelf is empty right now. Browse the full catalog to see
              everything we stock.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            {}
            <a href="#catalog" className={buttonVariants({ size: "sm" })}>
              Browse Catalog
            </a>
          </EmptyContent>
        </Empty>
      </section>
    );
  }

  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}

      className="mx-auto w-full max-w-7xl scroll-mt-20 px-4 py-8 md:px-6"
    >
      {}
      {heading}

      <CarouselViewport ariaLabel={title}>
        {showArrows && (
          <>
            {}
            {}
            <CarouselPrevious className="left-1 z-10 shadow-md min-[1366px]:-left-12" />
            <CarouselNext className="right-1 z-10 shadow-md min-[1366px]:-right-12" />
          </>
        )}

        <CarouselContent>
          {games.map((game) => (
            <CarouselItem
              key={game.id}

              className="basis-[85%] sm:basis-[46%] lg:basis-[31%] xl:basis-[24%]"
            >
              <BookCard
                game={game}
                flags={{
                  isBestSeller: flags.bestSellerIds.has(game.id),
                  isNew: flags.newIds.has(game.id),
                }}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </CarouselViewport>
    </section>
  );
}
