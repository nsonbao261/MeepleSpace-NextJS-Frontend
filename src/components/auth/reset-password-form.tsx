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

const subscribeToNothing = () => () => {};

const INVALID_LINK = "This reset link is invalid.";
const EXPIRED_LINK = "This reset link has expired.";

const RESET_FAILED = "This reset link is invalid or has expired";

type LinkState =
  | { status: "valid"; token: string }
  | { status: "invalid" }
  | { status: "expired" };

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

  const pendingReset = useAuthStore((state) => state.pendingReset);

  if (!mounted) {
    return <ResetSkeleton />;
  }

  const link = resolveReset(token, pendingReset);
  if (link.status !== "valid") {
    return <ResetError expired={link.status === "expired"} />;
  }

  return <ResetPasswordFields token={link.token} />;
}

function ResetPasswordFields({ token }: { token: string }) {
  const router = useRouter();
  const completePasswordReset = useAuthStore(
    (state) => state.completePasswordReset,
  );

  const [done, setDone] = React.useState(false);

  const form = useForm<ResetPasswordInput, unknown, ResetPasswordOutput>({
    resolver: zodResolver(resetPasswordSchema),
    criteriaMode: "all",
  });

  function onSubmit(values: ResetPasswordOutput) {
    const reset = completePasswordReset(token, values.password);
    if (!reset) {
      toast.error(RESET_FAILED);
      return;
    }

    setDone(true);

    toast.success("Password updated — sign in with your new password");
    router.push("/login");
  }

  if (done) {
    return <ResetSkeleton />;
  }

  return (
    <FormProvider {...form}>
      {}
      <form
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
      >
        {}
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

      {}
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
    <div className="flex flex-col gap-5" aria-hidden="true">
      <Skeleton className="h-11 w-full" />
      <Skeleton className="h-11 w-full" />
      <Skeleton className="h-11 w-full" />
    </div>
  );
}
