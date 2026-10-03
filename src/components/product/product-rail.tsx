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

/**
 * EC-6: below this many items the arrows are hidden outright rather than shown
 * disabled. Mirrors `RAIL_SIZE` in `queries.ts`, which is the number of items a
 * full rail holds.
 */
const FULL_RAIL_SIZE = 8;

export type MerchandisingFlags = {
  newIds: Set<string>;
  bestSellerIds: Set<string>;
};

/**
 * One product rail. Server component (plan amendment A-1): it renders the client
 * `Carousel` and passes server-rendered `BookCard` elements down as children.
 * The client components must never import the server ones — the boundary is the
 * carousel, not the rail.
 *
 * Two deliberate omissions:
 *  - No dot indicators (spec 5.4).
 *  - No compensating horizontal padding around the carousel. `CarouselContent`
 *    carries `-ml-4` and `CarouselItem` carries `pl-4`, and the pair cancels
 *    (A-3). Adding either would double-count the offset. This is also why the
 *    arrows cannot simply hang outside the rail at every width — see A-9.
 */
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
    // EC-7: the vendored Empty with a primary action, not a raw empty div.
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
            {/* buttonVariants on a plain anchor, not <Button render={<a/>} />:
                the primitive merges type="button" onto it, which is invalid on
                an anchor. Same precedent as site-footer.tsx. */}
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
      // `scroll-mt-20` clears the sticky h-16 navbar plus a little breathing
      // room, so an in-page jump does not park the heading under the bar.
      className="mx-auto w-full max-w-7xl scroll-mt-20 px-4 py-8 md:px-6"
    >
      {/* A-9: the heading is a sibling of the carousel, not a descendant. That
          lets the arrows sit against the track's own edges instead of inside
          the heading. It is what makes `absolute inset-y-0 my-auto` centre them
          on the cards — the carousel root is now the track's box, not
          heading + track. */}
      {heading}

      <CarouselViewport ariaLabel={title}>
        {showArrows && (
          <>
            {/* Horizontal offset is responsive, because "outside the track" is
                not always available. The rail is `max-w-7xl` inside `px-6`, so
                the track's left edge sits at `(V - 1280)/2 + 24` from the
                viewport edge. The vendored `-left-12` (48px) only lands
                on-screen once that exceeds 48, i.e. V >= 1330 — below that it
                would be clipped, which is what A-2 originally ran into.
                >= 1366px (a real laptop width) it clears by ~19px, so there
                they go outside; below that they overlay the outermost card, whose
                opaque `bg-background` keeps them legible. */}
            {/* `z-10` is load-bearing: embla translates the flex track with a
                transform, which makes it a stacking context, and it comes later
                in tree order than the arrows — so without an explicit z-index
                the scrolling cards can paint over the controls. */}
            <CarouselPrevious className="left-1 z-10 shadow-md min-[1366px]:-left-12" />
            <CarouselNext className="right-1 z-10 shadow-md min-[1366px]:-right-12" />
          </>
        )}

        <CarouselContent>
          {games.map((game) => (
            <CarouselItem
              key={game.id}
              // EC-17. Fractional bases at every breakpoint so the next card
              // always peeks and the affordance is discoverable. Verify at
              // 375 / 768 / 1280 / 1440 in Step 10 — a card must never be
              // clipped mid-column.
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
