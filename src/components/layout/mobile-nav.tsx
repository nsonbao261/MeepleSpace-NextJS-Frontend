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

export function MobileNav({
  links,
  account,
}: {
  links: NavLink[];

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

      {}
      <DropdownMenuContent align="start" className="w-56">
        {links.map((link) => (
          <DropdownMenuItem
            key={link.label}

            className="px-2 py-2 text-sm"
            render={<Link href={link.href} />}
          >
            {link.label}
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />

        {}
        {account}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
