import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Rail heading cluster. Server component.
 *
 * No arrow slot. Amendment A-2 originally parked the carousel arrows here as
 * children, because the vendored `CarouselPrevious` / `CarouselNext` read
 * `useCarousel()` and so must be descendants of `<Carousel>` — a heading
 * *outside* the carousel cannot host them. That is still true, but it no longer
 * matters: the arrows no longer need to live in the heading. They are siblings
 * of `CarouselContent` inside the carousel (amendment A-9), so the heading sits
 * above the carousel entirely and this component keeps only text and a link.
 *
 * The anchor id is deliberately NOT here. It goes on the rail wrapper so the
 * wrapper can carry the `scroll-mt-*` that clears the sticky navbar.
 */
export function SectionHeading({
  id,
  title,
  subline,
  viewAllHref,
}: {
  /** Applied to the `h2` so the rail's `section` can point `aria-labelledby` at it. */
  id?: string;
  title: string;
  subline: string;
  /**
   * Hash-only. A template-literal type rather than `string`, because
   * `typedRoutes: true` narrows `href` to `UrlObject | RouteImpl` and rejects a
   * bare string. Same trick as the link groups in `site-footer.tsx`.
   */
  viewAllHref: `#${string}`;
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        <h2
          id={id}
          className="text-xl font-semibold tracking-tight sm:text-2xl"
        >
          {title}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{subline}</p>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Link
          href={viewAllHref}
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "text-muted-foreground",
          )}
        >
          View all
        </Link>
      </div>
    </div>
  );
}
