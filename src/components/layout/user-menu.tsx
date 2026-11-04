"use client";

import Link from "next/link";
import { useQueryState } from "nuqs";
import {
  ChevronDownIcon,
  HeartIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  PackageIcon,
  TruckIcon,
  UserRoundIcon,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSessionStore } from "@/store/session-store";

const ACCOUNT_LINKS = [
  { label: "Wishlist", href: "/wishlist", icon: HeartIcon },
  { label: "Order History", href: "/orders", icon: PackageIcon },
  { label: "Order Tracking", href: "/orders/track", icon: TruckIcon },
  { label: "Profile/Settings", href: "/profile", icon: UserRoundIcon },
] as const;

/** Guests get Login/Register; signed-in users get the account dropdown. */
export function UserMenu() {
  const role = useSessionStore((state) => state.role);
  const signOut = useSessionStore((state) => state.signOut);
  const [, clearAs] = useQueryState("as");

  if (role === "guest") {
    return (
      <div className="flex items-center gap-2">
        <Button variant="outline" render={<Link href="/login" />}>
          Log in
        </Button>
        <Button render={<Link href="/register" />}>Sign up</Button>
      </div>
    );
  }

  function handleLogout() {
    signOut();
    // Clear ?as= so SessionFromQuery cannot sign the mock user back in.
    void clearAs(null);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="ghost" className="h-11 gap-1 px-2" aria-label="Account menu" />}
      >
        <Avatar size="sm">
          <AvatarFallback>{role === "admin" ? "AD" : "US"}</AvatarFallback>
        </Avatar>
        <ChevronDownIcon aria-hidden="true" className="size-3.5 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>{role === "admin" ? "Admin account" : "Your account"}</DropdownMenuLabel>
        {ACCOUNT_LINKS.map(({ label, href, icon: Icon }) => (
          <DropdownMenuItem key={href} render={<Link href={href} />}>
            <Icon aria-hidden="true" />
            {label}
          </DropdownMenuItem>
        ))}
        {role === "admin" && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem render={<Link href="/admin" />}>
              <LayoutDashboardIcon aria-hidden="true" />
              Admin Dashboard
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOutIcon aria-hidden="true" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
