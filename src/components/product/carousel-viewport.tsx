"use client";

import * as React from "react";

import { Carousel } from "@/components/ui/carousel";

type CarouselOptions = NonNullable<
  React.ComponentProps<typeof Carousel>["opts"]
>;

const DEFAULT_DURATION = 25;

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

  return (
    <Carousel opts={opts} aria-label={ariaLabel}>
      {children}
    </Carousel>
  );
}
