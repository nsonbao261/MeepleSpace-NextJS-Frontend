import type { Metadata } from "next";

import { AuthCard } from "@/components/auth/auth-shell";
import { AuthSwitcher } from "@/components/auth/auth-switcher";
import { RegisterForm } from "@/components/auth/register-form";

/**
 * `/register`, the second of the four `(auth)` routes.
 *
 * A server page, so it can export `metadata` at all — the same reason
 * `/login` is one, and A-4's reasoning applies unchanged.
 */
export async function generateMetadata(): Promise<Metadata> {
  return { title: "Create account" };
}

export default function RegisterPage() {
  return (
    // The same fragment as `/login`, for the same reason: two children of the
    // shell's centred column, separated by its `gap-6`.
    <>
      <AuthSwitcher active="register" />

      <AuthCard>
        {/* The page's own `h1`, which is why the shell's wordmark is a `<p>`
            and not a second heading (`auth-shell.tsx`). */}
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
