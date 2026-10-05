import Link from "next/link";
import { CheckIcon } from "lucide-react";

import { CoverFan } from "@/components/hero/cover-fan";
import { buttonVariants } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { getHeroCovers } from "@/lib/queries";

const TRUST_STATS = [
  "60+ Titles in stock",
  "Ships in 1–2 days",
  "30-day returns",
];

const FREE_SHIPPING_THRESHOLD = 500_000;

export function HeroBanner() {
  const covers = getHeroCovers();

  return (
    <section className="mx-auto w-full max-w-7xl px-4 md:px-6">
      <div className="grid items-center gap-10 py-12 lg:grid-cols-2 lg:gap-16 lg:py-20">
        <div>
          <p className="text-sm font-medium text-primary">
            Board games, delivered
          </p>

          {}
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Your wonderful space for board games
          </h1>

          <p className="mt-4 max-w-prose text-base text-muted-foreground sm:text-lg">
            Browse 60 curated titles from Vietnam&apos;s friendliest board game
            shop. Free shipping over {formatPrice(FREE_SHIPPING_THRESHOLD)}.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {}
            <Link href="#catalog" className={buttonVariants({ size: "lg" })}>
              Browse Catalog
            </Link>

            {}
            <Link
              href="#new-arrivals"
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              New Arrivals
            </Link>
          </div>

          <ul className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
            {TRUST_STATS.map((stat) => (
              <li key={stat} className="flex items-center gap-1.5">
                <CheckIcon
                  aria-hidden="true"
                  className="size-4 shrink-0 text-primary"
                />
                {stat}
              </li>
            ))}
          </ul>
        </div>

        <CoverFan games={covers} />
      </div>
    </section>
  );
}
