"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { MenuIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type NavLink = { label: string; href: `#${string}` };

/**
 * Mobile navigation. A floating panel anchored under the hamburger, replacing
 * the right-side `Sheet` this used to be.
 *
 * The items are `DropdownMenuItem`s with `render={<Link />}`, so each one is a
 * real anchor that is also a menu item. Verified rather than assumed: `Menu.Item`
 * extends `NonNativeButtonProps`, so it merges no `type` attribute onto the
 * rendered element, and `Menu.LinkItem` (the purpose-built part) produces
 * byte-identical markup — `<a href role="menuitem" tabindex="-1">` — for no gain.
 * This is the opposite of `Button render={<Link />} />`, which *does* leak
 * `type="button"` onto the anchor. Hence `buttonVariants` on bare anchors
 * everywhere else, and no `Button` here.
 *
 * Trade-off, accepted deliberately: as menu items these announce as "menu item"
 * rather than "link", and arrow keys move between them instead of Tab. That is
 * Base UI's roving-focus model and it is correct for a menu; the alternative
 * would be a hand-rolled disclosure with its own focus handling.
 */
export function MobileNav({
  links,
  account,
}: {
  links: NavLink[];
  /**
   * The account control's `menu` variant, built by `SiteHeader` so that this
   * file never imports it and the control has a single definition (§5.9). It
   * renders as items of *this* menu rather than opening a nested one — see
   * `account-control.tsx`'s header comment for why Base UI will not support
   * the nested shape.
   */
  account: ReactNode;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Open menu"
          />
        }
      >
        <MenuIcon />
      </DropdownMenuTrigger>

      {/* The vendored content defaults to `w-(--anchor-width)`, which here is
          the 36px trigger — far too narrow for a label. `w-56` wins the
          tailwind-merge `width` group. */}
      <DropdownMenuContent align="start" className="w-56">
        {links.map((link) => (
          <DropdownMenuItem
            key={link.label}
            // Taller than the 1.5 default `py-1` because these are the primary
            // navigation targets on the smallest screens.
            className="px-2 py-2 text-sm"
            render={<Link href={link.href} />}
          >
            {link.label}
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />

        {/* The only auth entry points below `md`, where the header's own copy of
            the control is `hidden`. These were two inert items ("There is no
            auth yet, Decision 4") and are now the same control, the same store
            read, and the same two actions as the header dropdown. */}
        {account}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
