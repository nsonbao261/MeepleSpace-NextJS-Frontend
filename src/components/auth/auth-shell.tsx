import type { ReactNode } from "react";

import { Card } from "@/components/ui/card";

/**
 * The `(auth)` split shell — Decision 8's reason for the group existing: no
 * sticky storefront navbar and no footer on a sign-in page, because a signed-in
 * visitor would be looking at a `Sign In` button while signing in.
 *
 * Server component, presentational. It receives the client forms as `children`
 * and imports no store, no form, and no client component, so the four routes do
 * not each re-solve centring and width.
 */
export function AuthShell({ children }: { children: ReactNode }) {
  return (
    // `min-h-svh`, not `flex-1`: the root `body` is `flex min-h-full flex-col`
    // and this group is its only child, so there is no sibling for `flex-1` to
    // share height with and the form would sit at the top of a short page.
    <div className="grid min-h-svh lg:grid-cols-2">
      {/*
        `hidden` is `display: none`, which also drops this column from the tab
        order and the accessibility tree — so below `lg` it is gone, not merely
        invisible (§9, EC-20). Same reasoning as the nav in site-header.tsx:30.
        On desktop it is decorative, hence `aria-hidden`: the wordmark repeats
        what the page's own heading already says, and a screen reader should not
        read it twice.
      */}
      <aside
        aria-hidden="true"
        className="hidden flex-col justify-between bg-primary p-10 text-primary-foreground lg:flex"
      >
        <p className="font-heading text-3xl font-semibold tracking-tight">
          Meeple Space
        </p>

        {/*
          The storefront's own h1, not new copy (§5.2). `text-primary-foreground`
          rather than a muted token: on this surface the foreground *is* the
          muted one, and the plan's design review puts the memorable move in the
          form column's rhythm instead of a collage here.
        */}
        <p className="max-w-prose text-2xl leading-snug font-medium text-balance">
          Your wonderful space for board games
        </p>
      </aside>

      {/* The page gutter, reused from the storefront rails
          (`mx-auto w-full max-w-7xl px-4 md:px-6`) so the form's left edge
          lines up with everything else at `lg`. */}
      <div className="flex w-full items-center justify-center px-4 py-12 md:px-6 lg:py-16">
        <div className="w-full max-w-md">{children}</div>
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
