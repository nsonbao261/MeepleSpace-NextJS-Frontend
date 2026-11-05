import Image from "next/image";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";

/** Editorial hero: full-bleed cover art with a scrimmed left text column. */
export function Hero() {
  return (
    <section className="relative isolate flex min-h-[24rem] items-center overflow-hidden bg-paper md:min-h-[30rem]">
      <Image
        src="/assets/images/common/hero-board-night.png"
        alt="Top-down view of a board game night: a felt table with cards, dice, tokens and player pawns"
        fill
        priority
        unoptimized
        sizes="100vw"
        className="absolute inset-0 object-cover object-center"
      />
      {/* Scrim: even wash on mobile, left-weighted gradient on desktop so white text clears the cream board. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-black/80 md:bg-transparent md:bg-linear-to-r md:from-black/85 md:via-black/80 md:to-transparent"
      />
      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-14 md:py-20">
        <div className="max-w-xl">
          <p className="text-sm font-medium text-white/75">Board game marketplace for Vietnam</p>
          <h1 className="mt-4 font-display text-5xl leading-[1.05] tracking-tight text-white md:text-6xl">
            Find your next game night.
          </h1>
          <p className="mt-5 max-w-md leading-relaxed text-white/80 md:text-lg">
            Board games, venues, and price comparison for the Vietnamese market.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/products" className={buttonVariants()}>
              Shop games
            </Link>
            <Link
              href="/venues"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "border-white/50 bg-transparent text-white hover:bg-white/10 hover:text-white focus-visible:border-white focus-visible:ring-white/50 dark:border-white/50 dark:bg-transparent dark:hover:bg-white/10 dark:hover:text-white",
              )}
            >
              Browse venues
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
