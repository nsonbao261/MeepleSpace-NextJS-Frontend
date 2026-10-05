import Link from "next/link";
import { ShoppingCartIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AccountControl } from "@/components/layout/account-control";
import { MobileNav, type NavLink } from "@/components/layout/mobile-nav";
import { ScrolledBar } from "@/components/layout/scrolled-bar";
import { ThemeToggle } from "@/components/shared/theme-toggle";

const NAV_LINKS: NavLink[] = [
  { label: "Catalog", href: "#catalog" },
  { label: "About Us", href: "#" },
  { label: "Contact Us", href: "#" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur">
      <ScrolledBar />

      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-2 px-4 md:gap-6 md:px-6">
        <MobileNav
          links={NAV_LINKS}
          account={<AccountControl variant="menu" />}
        />

        <Link
          href="#"
          className="shrink-0 font-heading text-lg font-semibold tracking-tight"
        >
          Meeple Space
        </Link>

        {}
        <nav
          aria-label="Main"
          className="hidden flex-1 items-center justify-center gap-6 md:flex"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-1 md:gap-2">
          <ThemeToggle />

          {}
          <Button variant="ghost" size="icon" aria-label="Cart">
            <ShoppingCartIcon />
          </Button>

          {}
          <div className="hidden md:flex md:items-center">
            <AccountControl variant="dropdown" />
          </div>
        </div>
      </div>
    </header>
  );
}
