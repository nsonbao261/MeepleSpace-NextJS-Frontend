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

  const registerUser = useAuthStore((state) => state.register);

  const form = useForm<RegisterInput, unknown, RegisterOutput>({
    resolver: zodResolver(uniqueEmailSchema()),

    criteriaMode: "all",
  });

  function onSubmit(values: RegisterOutput) {
    registerUser({
      email: values.email,
      firstName: values.firstName,
      lastName: values.lastName,
      password: values.password,
      dateOfBirth: values.dateOfBirth,
      phone: values.phone,
    });

    toast.success("Account created");

    router.push("/login");
  }

  return (
    <FormProvider {...form}>
      {}
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

        {}
        <PasswordFields intent="new" />

        {}
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

        {}
        <SubmitButton pendingLabel="Creating account…">
          Create account
        </SubmitButton>
      </form>
    </FormProvider>
  );
}
