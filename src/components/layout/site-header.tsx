"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "cn";

import { CartButton } from "@/components/layout/cart-button";
import { Logo } from "@/components/layout/logo";
import { MobileNav } from "@/components/layout/mobile-nav";
import { NavSearch } from "@/components/layout/nav-search";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { UserMenu } from "@/components/layout/user-menu";
import { NAV_LINKS } from "@/constants/nav";

/** Sticky shell with focus order: nav → search → cart → auth. */
export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4">
        <Logo />
        <nav aria-label="Main" className="hidden md:flex md:items-center md:gap-1">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
                  active && "text-foreground",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <NavSearch className="ml-auto hidden md:block md:w-64" />
        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <ThemeToggle />
          <CartButton />
          <div className="hidden md:block">
            <UserMenu />
          </div>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
