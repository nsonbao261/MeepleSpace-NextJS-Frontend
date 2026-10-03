"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { PasswordFields } from "@/components/auth/password-fields";
import { SubmitButton } from "@/components/auth/submit-button";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  resetPasswordSchema,
  type ResetPasswordInput,
  type ResetPasswordOutput,
} from "@/lib/auth-schemas";
import { useAuthStore, type PendingReset } from "@/stores/auth-store";

/**
 * §5.7's reset form, in three states that share one component rather than three
 * components: valid, expired, and invalid-or-missing.
 *
 * The token cannot be resolved on the server — `pendingReset` lives in the
 * client-only store — so the page passes `?token=` down as a prop and this file
 * checks it **after mount**. No match, a missing parameter, and an expired token
 * all render the same error state with no form (EC-6, EC-7); only the copy
 * distinguishes expiry.
 */

// A no-op subscription gives `useSyncExternalStore` a mount signal, exactly as
// `theme-toggle.tsx` does (D-6): the server snapshot is false, the client
// snapshot is true, and React resolves the difference across hydration.
const subscribeToNothing = () => () => {};

/** EC-6's copy does not name expiry; EC-7's does. Two strings, one component. */
const INVALID_LINK = "This reset link is invalid.";
const EXPIRED_LINK = "This reset link has expired.";

/** §5.10. Reached only if the token expired between the read above and submit. */
const RESET_FAILED = "This reset link is invalid or has expired";

type LinkState =
  | { status: "valid"; token: string }
  | { status: "invalid" }
  | { status: "expired" };

/**
 * The validity check, in one place. Returning the narrowed token rather than a
 * bare status means the valid branch cannot reach `completePasswordReset` with
 * `string | undefined`.
 */
function resolveReset(
  token: string | undefined,
  pendingReset: PendingReset | null,
): LinkState {
  if (token === undefined || pendingReset === null) {
    return { status: "invalid" };
  }
  if (pendingReset.token !== token) {
    return { status: "invalid" };
  }
  if (Date.parse(pendingReset.expiresAt) <= Date.now()) {
    return { status: "expired" };
  }
  return { status: "valid", token };
}

export function ResetPasswordForm({ token }: { token: string | undefined }) {
  const mounted = React.useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false,
  );
  // A stored record, not a derived object, so its reference is stable until it
  // changes and no `useShallow` is needed (A-11).
  const pendingReset = useAuthStore((state) => state.pendingReset);

  // Server and first client render both paint the skeleton, so rehydrating the
  // store with a real token cannot produce a hydration mismatch (EC-2).
  if (!mounted) {
    return <ResetSkeleton />;
  }

  const link = resolveReset(token, pendingReset);
  if (link.status !== "valid") {
    return <ResetError expired={link.status === "expired"} />;
  }

  return <ResetPasswordFields token={link.token} />;
}

/**
 * The actual new-password form. Split out so `useForm` runs only in the valid
 * branch without a conditional hook: `ResetPasswordForm` returns before this
 * component is ever mounted.
 */
function ResetPasswordFields({ token }: { token: string }) {
  const router = useRouter();
  const completePasswordReset = useAuthStore(
    (state) => state.completePasswordReset,
  );
  // After a successful reset the store clears `pendingReset`, which would flip
  // the validity check above to "invalid" and flash the error state during the
  // navigation. `done` keeps this component out of that branch instead.
  const [done, setDone] = React.useState(false);

  const form = useForm<ResetPasswordInput, unknown, ResetPasswordOutput>({
    resolver: zodResolver(resetPasswordSchema),
    criteriaMode: "all",
  });

  function onSubmit(values: ResetPasswordOutput) {
    const reset = completePasswordReset(token, values.password);
    if (!reset) {
      // A whole-flow failure, so a toast rather than a field error (§5.10). The
      // fields stay filled.
      toast.error(RESET_FAILED);
      return;
    }

    setDone(true);
    // §5.10: raised before the navigation and survives it, because `<Toaster />`
    // is mounted in the root layout (A-6).
    toast.success("Password updated — sign in with your new password");
    router.push("/login");
  }

  if (done) {
    return <ResetSkeleton />;
  }

  return (
    <FormProvider {...form}>
      {/* `noValidate` so zod owns every message; the browser's own bubbles
          would otherwise appear first and fight the `FieldError` text. */}
      <form
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
      >
        {/* The shared pair from Step 5, `intent="new"` — the same rule,
            `autocomplete="new-password"` on both fields, and the same
            `PASSWORD_RULE` help text as `/register`, so the two cannot drift
            (§5.3, §5.7). */}
        <PasswordFields intent="new" />

        <SubmitButton pendingLabel="Updating…">Update password</SubmitButton>
      </form>
    </FormProvider>
  );
}

function ResetError({ expired }: { expired: boolean }) {
  return (
    <div className="flex flex-col gap-5">
      <p role="alert" className="text-sm text-destructive">
        {expired ? EXPIRED_LINK : INVALID_LINK}
      </p>

      {/* `buttonVariants` on a bare `next/link`, never `Button render={<Link />}`,
          which merges `type="button"` onto an anchor (landing A-8, §5.9). */}
      <Link
        href="/forgot-password"
        className={buttonVariants({
          variant: "outline",
          className: "h-11 w-full",
        })}
      >
        Request a new link
      </Link>
    </div>
  );
}

function ResetSkeleton() {
  return (
    // `aria-hidden` because it is a placeholder, not content: a screen reader
    // should hear nothing rather than three empty boxes.
    <div className="flex flex-col gap-5" aria-hidden="true">
      <Skeleton className="h-11 w-full" />
      <Skeleton className="h-11 w-full" />
      <Skeleton className="h-11 w-full" />
    </div>
  );
}
