import Link from "next/link";
import { CheckIcon } from "lucide-react";

import { CoverFan } from "@/components/hero/cover-fan";
import { buttonVariants } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { getHeroCovers } from "@/lib/queries";

/**
 * FABRICATED. Placeholder layout content, not real inventory or service
 * metrics — see plan decision D-2. The shipping threshold below is invented
 * for the same reason. Replace both when the commerce terms are known.
 */
const TRUST_STATS = [
  "60+ Titles in stock",
  "Ships in 1–2 days",
  "30-day returns",
];

const FREE_SHIPPING_THRESHOLD = 500_000;

/**
 * Container definition shared with the header, footer and product page:
 * `mx-auto w-full max-w-7xl px-4 md:px-6`. The rails reuse it verbatim so the
 * hero's left edge and the rails' left edge line up exactly (plan A-3).
 */
export function HeroBanner() {
  const covers = getHeroCovers();

  return (
    <section className="mx-auto w-full max-w-7xl px-4 md:px-6">
      <div className="grid items-center gap-10 py-12 lg:grid-cols-2 lg:gap-16 lg:py-20">
        <div>
          <p className="text-sm font-medium text-primary">
            Board games, delivered
          </p>

          {/* No `font-heading` here on purpose: the base layer already applies
              the Fraunces WONK/SOFT axes to every h1-h6 (spec 5.3). */}
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Your wonderful space for board games
          </h1>

          <p className="mt-4 max-w-prose text-base text-muted-foreground sm:text-lg">
            Browse 60 curated titles from Vietnam&apos;s friendliest board game
            shop. Free shipping over {formatPrice(FREE_SHIPPING_THRESHOLD)}.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {/* buttonVariants on a plain <Link>, not <Button render={<Link/>} />:
                the Button primitive merges type="button" and tabindex onto the
                anchor, which is invalid HTML. Verified against the installed
                Base UI 1.8. Matches the precedent in site-footer.tsx. */}
            <Link href="#catalog" className={buttonVariants({ size: "lg" })}>
              Browse Catalog
            </Link>

            {/* The one navigation affordance the hero has that actually works
                without JavaScript, per the amended EC-16. The id is placed on
                the rail wrapper in Step 9, not on the heading. */}
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
