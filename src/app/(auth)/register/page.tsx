import type { Metadata } from "next";

import { AuthCard } from "@/components/auth/auth-shell";
import { AuthSwitcher } from "@/components/auth/auth-switcher";
import { RegisterForm } from "@/components/auth/register-form";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Create account" };
}

export default function RegisterPage() {
  return (
    <>
      <AuthSwitcher active="register" />

      <AuthCard>
        {}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Create account
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Start collecting your shelf in minutes.
          </p>
        </div>

        <RegisterForm />
      </AuthCard>
    </>
  );
}
