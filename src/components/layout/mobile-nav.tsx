"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQueryState } from "nuqs";
import { MenuIcon, ShoppingCartIcon } from "lucide-react";
import { useState } from "react";

import { cn } from "cn";

import { NavSearch } from "@/components/layout/nav-search";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NAV_LINKS } from "@/constants/nav";
import { useCartStore } from "@/store/cart-store";
import { useSessionStore } from "@/store/session-store";

/** Mobile sheet with nav, search, cart and auth; closes on navigation. */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const role = useSessionStore((state) => state.role);
  const signOut = useSessionStore((state) => state.signOut);
  const totalQuantity = useCartStore((state) => state.totalQuantity);
  const [, clearAs] = useQueryState("as");

  // Close on navigation by adjusting state during render (not in an effect).
  const [lastPathname, setLastPathname] = useState(pathname);
  if (lastPathname !== pathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  function handleLogout() {
    signOut();
    void clearAs(null);
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
            {role === "guest" ? (
              <>
                <Button render={<Link href="/login" />} className="h-11 w-full">
                  Log in
                </Button>
                <Button
                  variant="outline"
                  render={<Link href="/register" />}
                  className="h-11 w-full"
                >
                  Sign up
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" render={<Link href="/profile" />} className="h-11 w-full">
                  Profile/Settings
                </Button>
                <Button variant="ghost" className="h-11 w-full" onClick={handleLogout}>
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
