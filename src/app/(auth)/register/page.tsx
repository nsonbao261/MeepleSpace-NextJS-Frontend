import type { Metadata } from "next";
import Link from "next/link";

import { AuthCard } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/components/auth/register-form";
import { buttonVariants } from "@/components/ui/button";

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
    <AuthCard>
      {/* The page's own `h1`, which is why the brand column's wordmark is a
          `<p>` and not a second heading (`auth-shell.tsx`). */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Create account
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Start collecting your shelf in minutes.
        </p>
      </div>

      <RegisterForm />

      {/* The switch back to `/login` (§5.2, Decision 18). `buttonVariants` on a
          bare `next/link`, never `Button render={<Link />}`, which merges
          `type="button"` onto an anchor (landing A-8, §5.9) — the same
          reasoning as `site-footer.tsx:80`. */}
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className={buttonVariants({ variant: "link" })}>
          Sign in
        </Link>
      </p>
    </AuthCard>
  );
}
