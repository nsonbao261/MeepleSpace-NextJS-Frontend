"use client";

import Link from "next/link";
import {
  ChevronDownIcon,
  HeartIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  PackageIcon,
  TruckIcon,
  UserRoundIcon,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/common";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useLogout } from "@/hooks/use-logout";
import { useSessionStore } from "@/store/session-store";
import { getInitials } from "@/lib/format";

const ACCOUNT_LINKS = [
  { label: "Wishlist", href: "/wishlist", icon: HeartIcon },
  { label: "Order History", href: "/orders", icon: PackageIcon },
  { label: "Order Tracking", href: "/orders/track", icon: TruckIcon },
  { label: "Profile/Settings", href: "/profile", icon: UserRoundIcon },
] as const;

/** Guests get Login/Register; signed-in users get the account dropdown. */
export function UserMenu() {
  const status = useSessionStore((state) => state.status);
  const user = useSessionStore((state) => state.user);
  const role = useSessionStore((state) => state.role);
  const logout = useLogout();

  if (status === "hydrating") {
    return <Skeleton className="h-9 w-24" />;
  }

  if (status === "guest" || !user) {
    return (
      <div className="flex items-center gap-2">
        <ButtonLink variant="outline" href="/login">
          Log in
        </ButtonLink>
        <ButtonLink href="/register">Sign up</ButtonLink>
      </div>
    );
  }

  const initials = getInitials(user.name);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="ghost" className="h-11 gap-1 px-2" aria-label="Account menu" />}
      >
        <Avatar size="sm">
          {user.avatarUrl ? <AvatarImage src={user.avatarUrl} alt="" /> : null}
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <span className="hidden max-w-32 truncate text-sm font-medium sm:inline">{user.name}</span>
        <ChevronDownIcon aria-hidden="true" className="size-3.5 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
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
        <DropdownMenuItem onClick={logout}>
          <LogOutIcon aria-hidden="true" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
