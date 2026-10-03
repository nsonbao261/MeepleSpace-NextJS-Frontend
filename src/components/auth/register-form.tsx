"use client";

import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { FieldShell } from "@/components/auth/field-shell";
import { PasswordFields } from "@/components/auth/password-fields";
import { SubmitButton } from "@/components/auth/submit-button";
import {
  registerSchema,
  type RegisterInput,
  type RegisterOutput,
} from "@/lib/auth-schemas";
import { useAuthStore } from "@/stores/auth-store";

/**
 * §5.3's seven fields in D-4's order, and the two outcomes.
 *
 * Every field is a `FieldShell` or the shared `PasswordFields` pair — the RHF
 * idiom is written down once in `field-shell.tsx` (A-3) and not restated here,
 * which is the whole reason that file exists.
 */

/**
 * The uniqueness refinement, composed here because `auth-schemas.ts` is pure and
 * must stay importable without dragging the persisted store behind a validator
 * (Step 3's last box). Composed **inside** `useForm` rather than at module scope
 * so the predicate closes over the store's *current* `getState()`: a
 * module-level schema would capture one snapshot at import time and never see a
 * second registration.
 *
 * `findByEmail` normalises the address, so this is case-insensitive and survives
 * surrounding whitespace (EC-14) — and it is the same address the store writes
 * with, so a second registration over a seeded address collides too.
 */
function uniqueEmailSchema() {
  return registerSchema.refine(
    (data) => !useAuthStore.getState().findByEmail(data.email),
    {
      error: "An account with this email already exists.",
      path: ["email"],
    },
  );
}

export function RegisterForm() {
  const router = useRouter();
  // A stable action reference, so this selector is not a derived object (A-11).
  const registerUser = useAuthStore((state) => state.register);

  // A-2's three generics. Not decoration: `registerSchema` transforms the email
  // (trim, lowercase) and both optionals (`""` -> `null`, `+84` -> `0`), so a form
  // typed as `z.infer<S>` would hand `onSubmit` the schema's *output* while the
  // values it registered came from the input side, and those transforms would be
  // dropped somewhere in between.
  const form = useForm<RegisterInput, unknown, RegisterOutput>({
    resolver: zodResolver(uniqueEmailSchema()),
    // A-16, for the same reason as login: a password can break the length and
    // the digit rules at once, and without this RHF keeps one message and
    // `FieldShell`'s `types` branch is unreachable.
    criteriaMode: "all",
  });

  function onSubmit(values: RegisterOutput) {
    // `confirmPassword` is a refinement, not a field, and is absent from this
    // type — so it cannot be spread into the store by accident. The schema has
    // already proven the two are equal, and `onSubmit` only runs when it did.
    registerUser({
      email: values.email,
      firstName: values.firstName,
      lastName: values.lastName,
      password: values.password,
      dateOfBirth: values.dateOfBirth,
      phone: values.phone,
    });

    // §5.10: the toast is raised before the navigation and survives it, because
    // `<Toaster />` is mounted in the root layout (A-6).
    toast.success("Account created");
    // `/login`, never `/`. A newly registered account is **not** signed in —
    // `register` writes the user and leaves `sessionUserId` alone — so sending it
    // to the storefront would show a signed-out header on arrival (§5.3).
    router.push("/login");
  }

  return (
    // `FormProvider` is not optional: `FieldShell` and `PasswordFields` read
    // `useFormContext`, whose context defaults to `null`.
    <FormProvider {...form}>
      {/* `noValidate` so zod owns every message; the browser's own bubbles would
          otherwise appear first and fight the `FieldError` text. */}
      <form
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
      >
        <FieldShell<RegisterInput>
          name="email"
          label="Email"
          autoComplete="email"
          type="email"
          inputMode="email"
          placeholder="you@example.com"
        />

        <FieldShell<RegisterInput>
          name="firstName"
          label="First name"
          autoComplete="given-name"
          placeholder="Ada"
        />

        <FieldShell<RegisterInput>
          name="lastName"
          label="Last name"
          autoComplete="family-name"
          placeholder="Meeple"
        />

        {/* `intent="new"` is what puts `autocomplete="new-password"` on both
            fields — the security-relevant difference from sign-in, and what makes
            a password manager offer to generate and save. It also shows
            `PASSWORD_RULE` as help text, since a password is being chosen here.
            `registerSchema`'s own `passwordPair` is the same definition
            `/reset-password` uses, so the rule cannot drift between the two. */}
        <PasswordFields intent="new" />

        {/* Both optionals last (D-4): DOM order is the tab order (§9), and the
            six required fields are the ones somebody has to get through. */}
        <FieldShell<RegisterInput>
          name="dateOfBirth"
          label="Date of birth"
          autoComplete="bday"
          type="date"
          description="Optional. No minimum age."
        />

        <FieldShell<RegisterInput>
          name="phone"
          label="Mobile number"
          autoComplete="tel"
          type="tel"
          inputMode="tel"
          placeholder="0901234567"
          description="Optional. A Vietnamese mobile number."
        />

        {/* `isSubmitting` is read by `SubmitButton`, so the disabled-while-in-
            flight rule needs no code here — and it is what makes a double submit
            safe: the second one finds the duplicate and gets the field error
            (EC-15). */}
        <SubmitButton pendingLabel="Creating account…">
          Create account
        </SubmitButton>
      </form>
    </FormProvider>
  );
}
