"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { FieldShell } from "@/components/auth/field-shell";
import { GoogleButton } from "@/components/auth/google-button";
import { PasswordFields } from "@/components/auth/password-fields";
import { SubmitButton } from "@/components/auth/submit-button";
import { buttonVariants } from "@/components/ui/button";
import { FieldSeparator } from "@/components/ui/field";
import {
  loginSchema,
  type LoginInput,
  type LoginOutput,
} from "@/lib/auth-schemas";
import { useAuthStore } from "@/stores/auth-store";

/**
 * §5.4's two fields, and the two flows around them.
 *
 * `Forgot password?` arrived in Step 8 with the `/forgot-password` route it
 * points at: `typedRoutes: true` makes `Link`'s `href` resolve to `never` for a
 * route that does not exist yet, so a link lands in the step that creates its
 * target. That is the plan's "no step leaves a broken tree" rule beating its
 * checkbox placement — see A-20. The `Sign up` switch followed the same path and
 * arrived in Step 7, as a link on `page.tsx` rather than in this file.
 */

/**
 * EC-5. One string, both failure paths, byte-identical — an unknown address and
 * a wrong password must be indistinguishable. A second message here, however
 * carefully worded, is the difference between a mock and an account-existence
 * oracle.
 */
const SIGN_IN_FAILED = "Incorrect email or password";

export function LoginForm() {
  const router = useRouter();
  // A stable action reference, so this selector is not a derived object (A-11).
  const signIn = useAuthStore((state) => state.signIn);

  // The three generics are A-2's, not decoration: `loginSchema` transforms the
  // email (trim, lowercase), so a form typed as `z.infer<S>` would hand
  // `onSubmit` the schema's *output* while the values it registered came from
  // the input side, and the transform would be silently dropped somewhere in
  // between. `auth-schemas.ts` exports both types so no call site writes these
  // by hand.
  const form = useForm<LoginInput, unknown, LoginOutput>({
    resolver: zodResolver(loginSchema),
    // A-16. Without it RHF keeps one message per field, so a password that
    // breaks two rules shows one of them, and `FieldShell`'s `types` branch —
    // the vendored `FieldError`'s own multi-message path — is unreachable. It
    // fails quietly, which is why it is set here rather than left to default.
    criteriaMode: "all",
  });

  function onSubmit(values: LoginOutput) {
    const user = signIn(values.email, values.password);

    if (user === null) {
      // A toast, not a field error: this is a whole-flow outcome, and §5.10
      // forbids two channels shouting about one failure. Nothing is cleared —
      // the fields stay filled so the password can be corrected in place.
      toast.error(SIGN_IN_FAILED);
      return;
    }

    if (user.role === "admin") {
      // Decision 3 and D-1: an admin has no destination in this build. There is
      // no `/admin` route and no admin link, so a successful admin sign-in toasts
      // and stays put. The header swap in Step 10 is the only visible proof it
      // worked, and Step 11 checks exactly that.
      toast.success("Signed in as admin");
      return;
    }

    // §5.10: the toast is raised before the navigation and survives it, because
    // `<Toaster />` is mounted in the root layout (A-6). The first name is the
    // one place this build puts a `PublicUser` string into the DOM outside its
    // own page, and the spec sanctions it here.
    toast.success(`Welcome back, ${user.firstName}`);
    router.push("/");
  }

  return (
    // `FormProvider` is not optional: `FieldShell` and `PasswordFields` both
    // read `useFormContext`, whose context defaults to `null` — a form that
    // rendered them without one would throw on the first field, not warn.
    <FormProvider {...form}>
      {/* `noValidate` so zod owns every message. The browser's own bubbles
          would otherwise appear first and fight the `FieldError` text. */}
      <form
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
      >
        <FieldShell<LoginInput>
          name="email"
          label="Email"
          autoComplete="email"
          type="email"
          inputMode="email"
          placeholder="you@example.com"
        />

        <PasswordFields intent="current" confirm={false} />

        {/* §5.4: below the password field, before the separator. A real link,
            treated like the switch on `page.tsx` (design review item 2) —
            `buttonVariants` on a bare `next/link`, never
            `Button render={<Link />}`, which merges `type="button"` onto an
            anchor (landing A-8, §5.9). */}
        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className={buttonVariants({ variant: "link" })}
          >
            Forgot password?
          </Link>
        </div>

        <FieldSeparator className="[&_[data-slot=field-separator-content]]:bg-card">
          Or continue with
        </FieldSeparator>

        <GoogleButton />

        <SubmitButton pendingLabel="Signing in…">Sign in</SubmitButton>
      </form>
    </FormProvider>
  );
}
