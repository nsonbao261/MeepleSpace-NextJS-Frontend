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

export function ForgotPasswordForm() {
  const router = useRouter();

  const beginPasswordReset = useAuthStore((state) => state.beginPasswordReset);

  const form = useForm<ForgotPasswordInput, unknown, ForgotPasswordOutput>({
    resolver: zodResolver(forgotPasswordSchema),

    criteriaMode: "all",
  });

  function onSubmit(values: ForgotPasswordOutput) {
    const token = beginPasswordReset(values.email);

    toast.success("Check your email for a reset link");
    router.push(`/reset-password?token=${token}`);
  }

  return (
    <FormProvider {...form}>
      {}
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
