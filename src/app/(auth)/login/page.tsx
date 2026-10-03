import type { Metadata } from "next";

import { AuthCard } from "@/components/auth/auth-shell";
import { AuthSwitcher } from "@/components/auth/auth-switcher";
import { LoginForm } from "@/components/auth/login-form";

/**
 * `/login`, the first of the four `(auth)` routes.
 *
 * A server page so it can export `metadata` at all — a `"use client"` page
 * cannot, and the root layout's generic `Meeple Space` title on the one page
 * that greets a returning customer is the exact outcome the product page
 * avoided with `generateMetadata` (A-4's reasoning, same shape).
 */
export async function generateMetadata(): Promise<Metadata> {
  return { title: "Sign in" };
}

export default function LoginPage() {
  return (
    // A fragment, so the switcher and the card are two children of the shell's
    // centred column and inherit its `gap-6`. The switcher sits **outside** the
    // card because it is chrome (§5.2): inside, it would be part of a surface
    // whose height the register form changes, and it would read as one more
    // field of the form.
    <>
      <AuthSwitcher active="signin" />

      <AuthCard>
        {/* The page's own `h1`, which is why the shell's wordmark is a `<p>` and
            not a second heading (`auth-shell.tsx`). Fraunces comes from the base
            layer's `h1`–`h6` rule; only the size is set here. */}
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
