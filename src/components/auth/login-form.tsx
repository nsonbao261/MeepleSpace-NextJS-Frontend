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

const SIGN_IN_FAILED = "Incorrect email or password";

export function LoginForm() {
  const router = useRouter();

  const signIn = useAuthStore((state) => state.signIn);

  const form = useForm<LoginInput, unknown, LoginOutput>({
    resolver: zodResolver(loginSchema),

    criteriaMode: "all",
  });

  function onSubmit(values: LoginOutput) {
    const user = signIn(values.email, values.password);

    if (user === null) {
      toast.error(SIGN_IN_FAILED);
      return;
    }

    if (user.role === "admin") {
      toast.success("Signed in as admin");
      return;
    }

    toast.success(`Welcome back, ${user.firstName}`);
    router.push("/");
  }

  return (
    <FormProvider {...form}>
      {}
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

        {}
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
