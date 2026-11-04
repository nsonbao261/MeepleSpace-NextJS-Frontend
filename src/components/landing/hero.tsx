import Image from "next/image";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

/** Editorial hero: warm paper band, serif headline, asymmetric text/art split. */
export function Hero() {
  return (
    <section className="bg-paper text-paper-foreground">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:grid-cols-[1.05fr_0.95fr] md:gap-14 md:py-20">
        <div className="max-w-xl">
          <p className="text-sm font-medium text-primary-hover">
            Board game marketplace for Vietnam
          </p>
          <h1 className="mt-4 font-display text-5xl leading-[1.05] tracking-tight md:text-6xl">
            Find your next game night.
          </h1>
          <p className="mt-5 max-w-md leading-relaxed text-paper-muted md:text-lg">
            Board games, venues, and price comparison for the Vietnamese market.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/products" className={buttonVariants()}>
              Shop games
            </Link>
            <Link href="/venues" className={buttonVariants({ variant: "outline" })}>
              Browse venues
            </Link>
          </div>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-primary/10 md:aspect-[5/4]">
          <Image
            src="/assets/images/common/hero-board-night.png"
            alt="Top-down view of a board game night: a felt table with cards, dice, tokens and player pawns"
            fill
            priority
            unoptimized
            sizes="(min-width:768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
