"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuIcon, ShoppingCartIcon } from "lucide-react";
import { useState } from "react";

import { cn } from "cn";

import { NavSearch } from "@/components/layout/nav-search";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/common";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NAV_LINKS } from "@/constants";
import { useLogout } from "@/hooks/use-logout";
import { useCartStore, useSessionStore } from "@/store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { getInitials } from "@/lib/format";

/** Mobile sheet with nav, search, cart and auth; closes on navigation. */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const status = useSessionStore((state) => state.status);
  const user = useSessionStore((state) => state.user);
  const logout = useLogout();
  const totalQuantity = useCartStore((state) => state.totalQuantity);

  // Close on navigation by adjusting state during render (not in an effect).
  const [lastPathname, setLastPathname] = useState(pathname);
  if (lastPathname !== pathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="size-11 md:hidden"
            aria-label="Open menu"
          />
        }
      >
        <MenuIcon />
      </SheetTrigger>
      <SheetContent side="right" className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription className="sr-only">
            Navigation, search and account actions
          </SheetDescription>
        </SheetHeader>

        <nav aria-label="Mobile" className="px-4">
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex min-h-11 items-center rounded-lg px-2 text-base transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
                      active && "bg-muted font-medium",
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="px-4">
          <NavSearch />
        </div>

        <div className="px-4">
          <Link
            href="/cart"
            className="flex min-h-11 items-center justify-between rounded-lg px-2 transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            <span className="flex items-center gap-2 text-base">
              <ShoppingCartIcon aria-hidden="true" className="size-4" />
              Cart
            </span>
            {totalQuantity > 0 && (
              <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-semibold text-primary-foreground">
                {totalQuantity > 99 ? "99+" : totalQuantity}
              </span>
            )}
          </Link>
        </div>

        <div className="mt-auto flex items-center gap-2 px-4 pb-4">
          <ThemeToggle />
          <div className="flex flex-1 flex-col gap-2">
            {status === "hydrating" ? (
              <Skeleton className="h-11 w-full" />
            ) : status === "guest" || !user ? (
              <>
                <ButtonLink href="/login" className="h-11 w-full">
                  Log in
                </ButtonLink>
                <ButtonLink variant="outline" href="/register" className="h-11 w-full">
                  Sign up
                </ButtonLink>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 px-1">
                  <Avatar size="sm">
                    {user.avatarUrl ? <AvatarImage src={user.avatarUrl} alt="" /> : null}
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                  <span className="truncate text-sm font-medium">{user.name}</span>
                </div>
                <ButtonLink variant="outline" href="/wishlist" className="h-11 w-full">
                  Wishlist
                </ButtonLink>
                <ButtonLink variant="outline" href="/orders" className="h-11 w-full">
                  Order History
                </ButtonLink>
                <ButtonLink variant="outline" href="/profile" className="h-11 w-full">
                  Profile/Settings
                </ButtonLink>
                <Button variant="ghost" className="h-11 w-full" onClick={logout}>
                  Log out
                </Button>
              </>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
