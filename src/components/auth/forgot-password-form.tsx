"use client";

import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { FieldShell } from "@/components/auth/field-shell";
import { SubmitButton } from "@/components/auth/submit-button";
import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
  type ForgotPasswordOutput,
} from "@/lib/auth-schemas";
import { useAuthStore } from "@/stores/auth-store";

/**
 * §5.6's single field, and the one behaviour that must be uniform.
 *
 * The submit mints a token and navigates to `/reset-password?token=…`. It does
 * this for **any** well-formed address, including one with no account: a
 * response that differed would be an account-existence oracle, and there is no
 * inbox to deliver a link to anyway, so the token travels in the URL where the
 * visitor can actually follow it. §5.6's copy says the link is on its way; the
 * navigation is the honest part.
 *
 * This route is the one `(auth)` page that does **not** render `AuthCard` — see
 * its `page.tsx` for why.
 */

export function ForgotPasswordForm() {
  const router = useRouter();
  // A stable action reference, so this selector is not a derived object (A-11).
  const beginPasswordReset = useAuthStore((state) => state.beginPasswordReset);

  // A-2's three generics: `forgotPasswordSchema` transforms the email (trim,
  // lowercase), so a form typed as `z.infer<S>` would drop the transform and
  // hand `onSubmit` the raw address. `auth-schemas.ts` exports both types.
  const form = useForm<ForgotPasswordInput, unknown, ForgotPasswordOutput>({
    resolver: zodResolver(forgotPasswordSchema),
    // A-16. One field, but the reason is unchanged: without it RHF keeps one
    // message per field and `FieldShell`'s `types` branch is unreachable.
    criteriaMode: "all",
  });

  function onSubmit(values: ForgotPasswordOutput) {
    const token = beginPasswordReset(values.email);

    // §5.10: raised before the navigation and survives it, because `<Toaster />`
    // is mounted in the root layout (A-6). The string is fixed, so the toast
    // carries no user-supplied text.
    toast.success("Check your email for a reset link");
    router.push(`/reset-password?token=${token}`);
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
        <FieldShell<ForgotPasswordInput>
          name="email"
          label="Email"
          autoComplete="email"
          type="email"
          inputMode="email"
          placeholder="you@example.com"
        />

        <SubmitButton pendingLabel="Sending…">Send reset link</SubmitButton>
      </form>
    </FormProvider>
  );
}
