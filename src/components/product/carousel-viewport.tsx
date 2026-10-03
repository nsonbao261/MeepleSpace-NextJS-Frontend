"use client";

import * as React from "react";

import { Carousel } from "@/components/ui/carousel";

type CarouselOptions = NonNullable<
  React.ComponentProps<typeof Carousel>["opts"]
>;

/**
 * Embla's own default scroll duration, in 60fps ticks. Read out of the
 * installed `embla-carousel` 8 bundle, not guessed — passing `undefined` would
 * not fall back to it, so the reduced-motion branch has to name the value it is
 * overriding.
 */
const DEFAULT_DURATION = 25;

/**
 * Thin client boundary around the vendored `Carousel`, existing only to make
 * EC-15 reachable.
 *
 * Embla animates by default (`duration: 25`), so "no animation under
 * prefers-reduced-motion" is not free. The obvious fix — reading the media query
 * inside `product-rail.tsx` — would force the rail to be a client component and
 * drag the whole `BookCard` subtree across the boundary, which is exactly what
 * plan amendment A-1 exists to prevent. Keeping the rail on the server and
 * moving only this one decision into a client leaf costs about twenty lines and
 * preserves A-1.
 *
 * Drag still works under reduced motion: only the scroll *tween* is zeroed, the
 * drag interaction is untouched.
 *
 * Safe to change `opts` after mount: `useEmblaCarousel` compares options with
 * `areOptionsEqual`, a deep compare, so an unchanged object never triggers a
 * re-init and a changed one re-inits exactly once.
 */
export function CarouselViewport({
  ariaLabel,
  children,
}: {
  ariaLabel: string;
  children: React.ReactNode;
}) {
  const [opts, setOpts] = React.useState<CarouselOptions>({
    loop: false,
    align: "start",
    duration: DEFAULT_DURATION,
  });

  React.useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");

    const sync = () => {
      setOpts((previous) => ({
        ...previous,
        duration: query.matches ? 0 : DEFAULT_DURATION,
      }));
    };

    sync();
    query.addEventListener("change", sync);

    return () => query.removeEventListener("change", sync);
  }, []);

  // `aria-label` because the vendored Carousel hardcodes
  // `role="region" aria-roledescription="carousel"`, and the rail's heading now
  // lives inside it (A-2). Without a name the region is an unlabelled landmark.
  return (
    <Carousel opts={opts} aria-label={ariaLabel}>
      {children}
    </Carousel>
  );
}
