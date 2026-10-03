"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useShallow } from "zustand/react/shallow";

import { UserAvatar } from "@/components/auth/user-avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/format";
import { useAuthStore } from "@/stores/auth-store";

/**
 * §5.8's read-only account page, and the self-guard from Decision 16.
 *
 * **The guard is a rendering convention, not authorisation.** Nothing here
 * checks a session before rendering; the page ships, and the client redirects
 * after mount. With a mocked store in localStorage that is the whole of the
 * security model, and it would be dishonest to dress it up: the profile is
 * already in the payload the browser holds. What the guard does buy is the
 * *convention* that a signed-out visitor is never shown a profile and never has
 * one flash past on screen. The real enforcement arrives with the backend, and
 * this file is written to be deleted then, not patched.
 */

// A no-op subscription gives `useSyncExternalStore` a mount signal, exactly as
// `theme-toggle.tsx` does (D-6): the server snapshot is false, the client
// snapshot is true, and React resolves the difference across hydration.
const subscribeToNothing = () => () => {};

/** EC-10: a missing optional field is a dash, never `Invalid Date` and never a blank row. */
const ABSENT = "—";

export function AccountView() {
  const router = useRouter();
  const mounted = React.useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false,
  );
  // A-11: `getSessionUser()` allocates a fresh object on every call, so it has to
  // be wrapped or React would compare new snapshots forever and re-render in a
  // loop. This is the same reason the state selector is a `useShallow` call
  // rather than a bare read.
  const user = useAuthStore(useShallow((state) => state.getSessionUser()));
  const signOut = useAuthStore((state) => state.signOut);

  React.useEffect(() => {
    // After mount, not during render: `router.replace` is a navigation, not a
    // render-time side effect.
    if (mounted && user === null) {
      router.replace("/login");
    }
  }, [mounted, user, router]);

  // Both the pre-hydration pass and the redirecting pass paint the same
  // skeleton, so a signed-out visitor sees a brief placeholder and then `/login`
  // — never a frame of someone else's profile (EC-2).
  if (!mounted || user === null) {
    return <AccountSkeleton />;
  }

  function onSignOut() {
    signOut();
    // §5.8 sends the visitor back to `/account` and lets the guard forward them
    // to `/login`. Step 9 collapses that into one navigation: the two routes
    // have the same destination, and skipping `/account` drops a render of this
    // page, its skeleton, and a replace from the history stack. Recorded in
    // `plan.md` as a deliberate simplification of the spec's wording.
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
          {/* The `h1` lives here rather than in the server page so it sits beside
              the avatar as one visual unit; `account/page.tsx` renders no
              heading of its own. */}
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
          {/* Guarded on `null` rather than handed straight to `formatDate`:
              `Intl.DateTimeFormat.format(new Date("nonsense"))` is `"Invalid
              Date"`, and §5.8 forbids exactly that string appearing in this
              layout. */}
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

/**
 * One read-out row. A `dt`/`dd` pair rather than a label-and-value grid of
 * `div`s: these are name/value pairs, and the definition list is what lets a
 * screen reader move between them.
 */
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
    // `aria-hidden` because it is a placeholder, not content: a screen reader
    // should hear nothing rather than an empty page title.
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
