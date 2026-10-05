import type { Metadata } from "next";

import { AuthCard } from "@/components/auth/auth-shell";
import { AuthSwitcher } from "@/components/auth/auth-switcher";
import { LoginForm } from "@/components/auth/login-form";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Sign in" };
}

export default function LoginPage() {
  return (
    <>
      <AuthSwitcher active="signin" />

      <AuthCard>
        {}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Welcome back. Sign in to your Meeple Space account.
          </p>
        </div>

        <LoginForm />
      </AuthCard>
    </>
  );
}
