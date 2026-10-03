import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { cn } from "@/lib/utils";

/**
 * The `(auth)` mode switcher (spec §5.2, Amendment 1). `Sign in` on the left,
 * `Create account` on the right, and **one** form in the DOM at a time.
 *
 * Server component (A-25). There is nothing here that needs interactivity: both
 * segments are `next/link`s, and which one is active is a fact about the route
 * that the server already knows. `active` is therefore a prop rather than a
 * `usePathname()` read, which would have made a server component a client one to
 * read a value the caller already has.
 *
 * `AuthShell` cannot pass it instead. This renders on two of four `(auth)`
 * routes and the other two must not have it, so it cannot live in the layout —
 * and a layout receives no props from the page it wraps in any case. That is why
 * each mode page passes its own, and why it is an explicit prop rather than an
 * ambient lookup.
 */

/** The two modes. `signin` maps to `/login`, not `/signin`. */
export type AuthMode = "signin" | "register";

/**
 * Both entries, `Sign in` first, because the **DOM order is the tab order** and
 * it is also the visual order (§9). A two-item control read right-to-left is a
 * bug, not a preference.
 *
 * `as const` and nothing more: it narrows `mode` to the union so the comparison
 * below is exhaustive, and it keeps `href` as the literal `"/login"` /
 * `"/register"` so `typedRoutes: true` still resolves both against the generated
 * route union. No `satisfies` clause, because there is nothing left for it to
 * prove — the two entries and the prop type already have to agree.
 */
const MODES = [
  { mode: "signin", href: "/login", label: "Sign in" },
  { mode: "register", href: "/register", label: "Create account" },
] as const;

/**
 * One segmented control, two links (spec D-22, D-23, D-27; A-25, A-26).
 *
 * Three details of the vendored primitive, all read off the installed file
 * rather than assumed (A-24):
 *
 * 1. **`role="group"` is the primitive's, not ours.** `button-group.tsx:32` sets
 *    it. Only the `aria-label` is added here; duplicating the role would give a
 *    screen reader two nested groups.
 * 2. **`className` reaches the element** (`button-group.tsx:35`), so `w-full`
 *    overrides the primitive's `w-fit` and `flex-1` on each segment makes them
 *    split the row evenly.
 * 3. **Children are identified by `data-slot`**, which is why each link carries
 *    `data-slot="button"` below. Without it the segmented control degrades into
 *    two fully-rounded buttons with a doubled border down the middle — still
 *    readable, but no longer one control.
 */
export function AuthSwitcher({ active }: { active: AuthMode }) {
  return (
    <ButtonGroup aria-label="Sign in or create an account" className="w-full">
      {MODES.map(({ mode, href, label }) => {
        const current = mode === active;

        return (
          /**
           * `buttonVariants` on a **bare `next/link`**, never
           * `Button render={<Link />}`, which merges `type="button"` onto an
           * anchor (landing A-8, §5.9). This is the third such link in the
           * feature and the same rule applies.
           *
           * `aria-current="page"`, never `aria-selected` (A-25): these are two
           * routes with two `generateMetadata` titles, so this is navigation,
           * not two views of one surface. `aria-expanded` — which
           * `buttonVariants` *does* style on `outline`, and which would have
           * marked the active segment for free — is forbidden by §7.2, because
           * on a link that navigates it claims the page is expanded when it is
           * not.
           *
           * `h-11` matches the inputs and `SubmitButton` (Decision 20), so the
           * card is one vertical rhythm. The active segment is `bg-muted`,
           * **not** `bg-primary` (A-26): `SubmitButton` is a full-width
           * `bg-primary` block a few lines below, and a second aubergine element
           * inside one card would put two competing primary actions on one
           * screen. `--muted` is `--paper-100` on a `--paper-0` page, so it
           * reads as selected without a second accent colour — and it is appended
           * **after** `buttonVariants` so tailwind-merge drops the `outline`
           * variant's own `bg-background` and `hover:bg-muted`.
           */
          <Link
            key={mode}
            href={href}
            data-slot="button"
            aria-current={current ? "page" : undefined}
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "h-11 flex-1",
              current && "bg-muted text-foreground",
            )}
          >
            {label}
          </Link>
        );
      })}
    </ButtonGroup>
  );
}
