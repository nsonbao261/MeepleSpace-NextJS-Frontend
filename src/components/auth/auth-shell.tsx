import type { ReactNode } from "react";
import Link from "next/link";

import { Card } from "@/components/ui/card";

/**
 * The `(auth)` shell — Decision 8's reason for the group existing: no
 * sticky storefront navbar and no footer on a sign-in page, because a signed-in
 * visitor would be looking at a `Sign In` button while signing in.
 *
 * A **brand band** over a centred column (spec §5.2, Decision 25), not the
 * split it replaced. The split put a decorative `aria-hidden` column beside
 * the form; on `/register`, whose card is seven fields tall, that left the
 * form in a narrow column next to a mostly-empty one. The band gives the form
 * the whole width and keeps the brand signal.
 *
 * Server component, presentational. It receives the client forms as `children`
 * and imports no store, no form, and no client component, so the four routes do
 * not each re-solve centring and width.
 */
export function AuthShell({ children }: { children: ReactNode }) {
  return (
    // `flex min-h-svh flex-col`, and **not** a `grid` — A-26. The register card
    // is taller than a short desktop viewport, so the height has to be a
    // *minimum* the column can grow past. `flex-1` on the slot below is what
    // centres the form on a tall page without making the page's height a fixed
    // value the card cannot exceed.
    //
    // `min-h-svh` rather than `flex-1` on this root: the root `body` is
    // `flex min-h-full flex-col` and this group is its only child, so there is
    // no sibling for a `flex-1` to share height with.
    <div className="flex min-h-svh flex-col">
      {/*
        The band. `bg-background text-foreground` — the old
        `bg-primary text-primary-foreground` was right for a surface filling
        half the screen and wrong for one that does not, and §7.1 drops it for
        the same reason: the accent colour belongs to the switcher's inactive
        segments and `SubmitButton`, not to a decorative panel. The band
        therefore reads as space plus a wordmark, and gets its edge from its
        own whitespace rather than a rule — which is also how `SiteHeader` sits
        on the background with no `border-b`.

        **No `aria-hidden`**, and the wordmark is not a heading: on these
        routes there is no `SiteHeader`, so this is the only brand signal on the
        screen and it is information. It is still not a heading, because each of
        the four routes owns the page's `h1` and a second one would be a
        document-structure problem. The old comment claimed the wordmark
        "repeats what the page's heading already says" — it never did, since
        `Sign in` does not say *Meeple Space*.

        The wordmark is a `Link` to `/`, matching `SiteHeader`'s: these routes
        have no storefront navbar, so without it there is no way back to the
        catalog except the browser's back button. The link wraps **only** the
        wordmark, not the tagline, so its accessible name is the brand and not
        the brand plus the marketing line.

        Centred, and sharing the slot's `max-w-md` and gutter, so the wordmark
        and the tagline's left edges land on the card's left edge. That is the
        one alignment the four routes get for free from here.
      */}
      <div className="px-4 pt-10 pb-8 md:px-6 md:pt-14 md:pb-10">
        <div className="mx-auto w-full max-w-md text-center">
          <Link
            href="/"
            className="inline-block font-heading text-3xl font-semibold tracking-tight transition-colors hover:text-muted-foreground"
          >
            Meeple Space
          </Link>

          {/* The storefront's own line, not new copy (§5.2), and
              `text-muted-foreground` per §7.1's brand-band row. */}
          <p className="mt-1.5 text-sm text-balance text-muted-foreground">
            Your wonderful space for board games
          </p>
        </div>
      </div>

      {/* The page gutter, reused from the storefront rails
          (`mx-auto w-full max-w-7xl px-4 md:px-6`) so the form's left edge
          lines up with everything else at `lg`.

          `flex-1` is A-26's fix and it is load-bearing: with `items-center`
          against a *fixed* height, a card taller than that height overflows in
          both directions and its top — the heading and the first field — is
          clipped and unreachable. Here the page is at least `min-h-svh` and
          grows with the card, so `flex-1` centres on a tall page and simply
          does nothing on a short one.

          `gap-6` lives on this inner column rather than on the outer flex row.
          A row's `gap` is between its children, and its only child here is
          this column, so a `gap-6` on the row would be inert — the switcher and
          the card are two children of *this* column, because a page returns a
          fragment and both land in the same `max-w-md`. One gap, in one place,
          for all four routes: it is why `/forgot-password`'s own `gap-6` wrapper
          is redundant. */}
      <div className="flex flex-1 items-center justify-center px-4 py-12 md:px-6 lg:py-16">
        <div className="flex w-full max-w-md flex-col gap-6">{children}</div>
      </div>
    </div>
  );
}

/**
 * The form surface: a real `Card`, unlike the unpanelled landing card (§7.1).
 *
 * `shadow-sm` is the whole reason this is a card at all — in light mode
 * `--card` and `--background` are both `var(--paper-0)`, so the ring alone
 * carries the edge. One surface, one border, one shadow step; nothing nests.
 *
 * The shell cannot render this itself, because a layout gets no props from the
 * page it wraps, and `/forgot-password` has to opt *out* of the card: one
 * input does not get a card, a shadow, or a heading treatment implying more is
 * coming (§5.6). So the surface is exported here and the routes that want it
 * ask for it — three of four do, and the fourth's absence is the exception
 * rather than the default.
 */
export function AuthCard({ children }: { children: ReactNode }) {
  return <Card className="gap-6 p-6 shadow-sm">{children}</Card>;
}
