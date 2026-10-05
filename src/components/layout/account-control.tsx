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

const MENU_ITEM = "px-2 py-2 text-sm";

const subscribeToNothing = () => () => {};

type AccountControlProps = {
  variant?: "dropdown" | "menu";
};

export function AccountControl({ variant = "dropdown" }: AccountControlProps) {
  const mounted = React.useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false,
  );

  const user = useAuthStore(useShallow((state) => state.getSessionUser()));
  const signOut = useAuthStore((state) => state.signOut);

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
        {}
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
      {}
      <DropdownMenuTrigger
        render={<Button variant="ghost" size="lg" className="pl-1.5" />}
      >
        <UserAvatar
          avatarUrl={user.avatarUrl}
          firstName={user.firstName}
          lastName={user.lastName}
        />

        {}
        <span className="max-w-24 truncate">
          {user.firstName} {user.lastName}
        </span>
      </DropdownMenuTrigger>

      {}
      <DropdownMenuContent align="end" className="w-56">
        <SignedInItems signOut={signOut} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function SignedInItems({ signOut }: { signOut: () => void }) {
  return (
    <>
      <DropdownMenuItem className={MENU_ITEM} render={<Link href="/account" />}>
        Account
      </DropdownMenuItem>

      {}
      <DropdownMenuItem className={MENU_ITEM} onClick={signOut}>
        Sign out
      </DropdownMenuItem>
    </>
  );
}
