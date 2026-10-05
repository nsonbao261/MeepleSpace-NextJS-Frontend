"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useShallow } from "zustand/react/shallow";

import { UserAvatar } from "@/components/auth/user-avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/format";
import { useAuthStore } from "@/stores/auth-store";

const subscribeToNothing = () => () => {};

const ABSENT = "—";

export function AccountView() {
  const router = useRouter();
  const mounted = React.useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false,
  );

  const user = useAuthStore(useShallow((state) => state.getSessionUser()));
  const signOut = useAuthStore((state) => state.signOut);

  React.useEffect(() => {
    if (mounted && user === null) {
      router.replace("/login");
    }
  }, [mounted, user, router]);

  if (!mounted || user === null) {
    return <AccountSkeleton />;
  }

  function onSignOut() {
    signOut();

    router.push("/login");
  }

  return (
    <div className="flex flex-col gap-8">
      <header className="flex items-center gap-4">
        <UserAvatar
          avatarUrl={user.avatarUrl}
          firstName={user.firstName}
          lastName={user.lastName}
          size="lg"
        />

        <div className="flex flex-col gap-1.5">
          {}
          <h1 className="font-heading text-2xl leading-tight font-semibold">
            {user.firstName} {user.lastName}
          </h1>
        </div>
      </header>

      <dl className="grid gap-5 sm:grid-cols-2">
        <Detail label="Email">
          <a
            href={`mailto:${user.email}`}
            className="underline-offset-4 hover:underline"
          >
            {user.email}
          </a>
        </Detail>

        <Detail label="Mobile number">{user.phone ?? ABSENT}</Detail>

        <Detail label="Date of birth">
          {}
          {user.dateOfBirth === null ? ABSENT : formatDate(user.dateOfBirth)}
        </Detail>
      </dl>

      <div className="border-t border-border pt-6">
        <Button variant="outline" onClick={onSignOut}>
          Sign out
        </Button>
      </div>
    </div>
  );
}

function Detail({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium">{children}</dd>
    </div>
  );
}

function AccountSkeleton() {
  return (
    <div className="flex flex-col gap-8" aria-hidden="true">
      <div className="flex items-center gap-4">
        <Skeleton className="size-10 rounded-full" />
        <Skeleton className="h-7 w-40" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Skeleton className="h-10" />
        <Skeleton className="h-10" />
        <Skeleton className="h-10" />
      </div>

      <Skeleton className="h-9 w-28" />
    </div>
  );
}
