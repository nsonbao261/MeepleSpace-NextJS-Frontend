"use client";

import * as React from "react";
import Link from "next/link";
import { useShallow } from "zustand/react/shallow";

import { UserAvatar } from "@/components/auth/user-avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/stores/auth-store";

/**
 * The header's account state (§5.9, Decision 9). One client island inside the
 * **server** `SiteHeader` — making the header client would pull it, `NAV_LINKS`,
 * and everything `MobileNav` imports across the boundary. `ThemeToggle` is the
 * established precedent for exactly this shape.
 *
 * **One component, two placements, one store read.** `SiteHeader` renders it
 * twice — `dropdown` in the action row, `menu` inside `MobileNav`'s panel —
 * because the two placements have opposite requirements, and a second
 * component would be the two-controls-sharing-one-session that §5.9 calls a bug
 * waiting to happen. Both instances read the same store and render the same two
 * actions, so there is no state to drift.
 *
 * **Why `variant` exists rather than a nested menu.** The obvious design is one
 * `DropdownMenu` rendered in both places, and it does not work. Verified in the
 * installed Base UI 1.8: `MenuRoot.js:60-86` sets `parent.type = 'menu'` only
 * when the child sits inside `Menu.SubmenuRoot`. A plain `Menu.Root` inside
 * another menu's popup gets `parent.type === undefined`, which costs it the
 * floating tree (`MenuRoot.js:359, 380` gate `externalTree` on
 * `floatingParentNodeIdFromContext`) and gives it a *second* modal backdrop
 * (`MenuPositioner.js:242`). The parent would fight it for roving focus and the
 * backdrop would sit between them. Base UI's supported nesting is
 * `DropdownMenuSub`, which is a different shape — a hover/arrow-opened submenu,
 * not a trigger with its own popup. So inside a popup this contributes **items
 * to the parent menu** instead of opening a second one, which is also the only
 * way a signed-in mobile visitor stays reachable by arrow key: a bare `Button`
 * in a popup is not a `Menu.Item` and the roving focus skips it entirely.
 *
 * **No icons in either variant.** The sibling nav items in the same popup are
 * plain text, and two self-describing items do not need glyphs. The design
 * review's standing instruction is to remove one accessory, not add one.
 */

/** Matches the nav items above it in `MobileNav`, so the two groups read as one list. */
const MENU_ITEM = "px-2 py-2 text-sm";

// A no-op subscription gives `useSyncExternalStore` a mount signal, exactly as
// `theme-toggle.tsx` does (D-6): the server snapshot is false, the client
// snapshot is true, and React resolves the difference across hydration. The
// usual `setMounted` in an effect is rejected by the react-hooks lint rules.
const subscribeToNothing = () => () => {};

type AccountControlProps = {
  /**
   * `dropdown` — the header action row: a trigger plus its own popup.
   * `menu` — inside `MobileNav`'s popup, contributing items to the parent menu.
   */
  variant?: "dropdown" | "menu";
};

export function AccountControl({ variant = "dropdown" }: AccountControlProps) {
  const mounted = React.useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false,
  );

  // A-11: `getSessionUser()` allocates a fresh object per call, so it has to be
  // wrapped or React compares new snapshots forever and re-renders in a loop.
  const user = useAuthStore(useShallow((state) => state.getSessionUser()));
  const signOut = useAuthStore((state) => state.signOut);

  // Server and first client render both emit the signed-out controls, and the
  // swap happens after mount. That is EC-2's accepted cost of a client-only
  // session (Decision 1): the signed-out HTML is what a crawler and the
  // pre-hydration paint both see, whichever account is actually signed in.
  if (!mounted || user === null) {
    if (variant === "menu") {
      return (
        <>
          <DropdownMenuItem
            className={MENU_ITEM}
            render={<Link href="/login" />}
          >
            Sign In
          </DropdownMenuItem>
          <DropdownMenuItem
            className={`${MENU_ITEM} font-medium`}
            render={<Link href="/register" />}
          >
            Sign Up
          </DropdownMenuItem>
        </>
      );
    }

    return (
      <div className="flex items-center gap-2">
        {/* `buttonVariants` on a bare `next/link`, never `Button render={<Link />}`:
            `Button` merges `type="button"` onto whatever it renders, so that
            spelling emits `<a type="button">` (landing A-8, §5.9). */}
        <Link href="/login" className={buttonVariants({ variant: "outline" })}>
          Sign In
        </Link>
        <Link href="/register" className={buttonVariants()}>
          Sign Up
        </Link>
      </div>
    );
  }

  if (variant === "menu") {
    return <SignedInItems signOut={signOut} />;
  }

  return (
    <DropdownMenu>
      {/* No `aria-label`: the trigger's accessible name comes from its own
          visible text, so it names the account (§5.9) and cannot drift from what
          is on screen. An `aria-label` here would replace a real name with a
          vague one, which is the failure WCAG 2.5.3 is about.
          The avatar is `alt=""` already, so it contributes nothing here. */}
      <DropdownMenuTrigger
        render={<Button variant="ghost" size="lg" className="pl-1.5" />}
      >
        <UserAvatar
          avatarUrl={user.avatarUrl}
          firstName={user.firstName}
          lastName={user.lastName}
        />

        {/* Bounded rather than free: the same trigger renders inside a `w-56`
            mobile popup, where an unbounded name would overflow the edge.
            `truncate` then does the rest. */}
        <span className="max-w-24 truncate">
          {user.firstName} {user.lastName}
        </span>
      </DropdownMenuTrigger>

      {/* `w-56` beats the vendored `w-(--anchor-width)` default for the same
          reason `MobileNav` sets it — the anchor is a wide trigger, not a
          36px icon. */}
      <DropdownMenuContent align="end" className="w-56">
        <SignedInItems signOut={signOut} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * §5.9's two items and nothing else: the profile link and `Sign out`. No third
 * item, no disabled placeholder — a stub affordance is the dead-end the signed-in
 * state is supposed to avoid.
 *
 * `Menu.Item render={<Link />}` is the pattern `mobile-nav.tsx`'s header comment
 * documents as safe: `Menu.Item` extends `NonNativeButtonProps`, so it merges no
 * `type` onto the anchor, and the result is a real link that middle-click and
 * open-in-new-tab both work on. `Button render={<Link />}` is the opposite.
 */
function SignedInItems({ signOut }: { signOut: () => void }) {
  return (
    <>
      <DropdownMenuItem className={MENU_ITEM} render={<Link href="/account" />}>
        Account
      </DropdownMenuItem>

      {/* No navigation. The store is the only source of truth and this component
          holds no local copy, so the header repaints signed-out in the same
          tick — which is exactly the property Step 9 deferred its
          "header updates in the same tick" box to prove. Navigating as well
          would hide that proof behind a page change. */}
      <DropdownMenuItem className={MENU_ITEM} onClick={signOut}>
        Sign out
      </DropdownMenuItem>
    </>
  );
}
