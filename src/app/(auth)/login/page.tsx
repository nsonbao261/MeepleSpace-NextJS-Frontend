import type { Metadata } from "next";
import Link from "next/link";

import { AuthCard } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";
import { buttonVariants } from "@/components/ui/button";

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
    <AuthCard>
      {/* The page's own `h1`, which is why the brand column's wordmark is a
          `<p>` and not a second heading (`auth-shell.tsx`). Fraunces comes from
          the base layer's `h1`–`h6` rule; only the size is set here. */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Welcome back. Sign in to your Meeple Space account.
        </p>
      </div>

      <LoginForm />

      {/* The `Sign up` switch (§5.2, Decision 18), deferred from Step 6 by A-20:
          `/register` did not exist then, and `typedRoutes: true` makes a `Link`
          to a missing route a compile error. `buttonVariants` on a bare
          `next/link`, never `Button render={<Link />}`, which merges
          `type="button"` onto an anchor (landing A-8, §5.9). */}
      <p className="text-center text-sm text-muted-foreground">
        New to Meeple Space?{" "}
        <Link href="/register" className={buttonVariants({ variant: "link" })}>
          Create an account
        </Link>
      </p>
    </AuthCard>
  );
}
