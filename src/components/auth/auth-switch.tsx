"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ArrowRight, Dice5 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AuthSwitchProps = {
  variant?: "panel" | "compact";
  className?: string;
};

const SWITCH_COPY = {
  login: {
    eyebrow: "New to MeepleSpace",
    heading: "Join the table",
    body: "Create an account to save wishlists, track orders and review games.",
    cta: "Create account",
    href: "/register",
  },
  register: {
    eyebrow: "Already a member",
    heading: "Welcome back",
    body: "Log in to pick up right where you left off.",
    cta: "Log in",
    href: "/login",
  },
} as const;

export function AuthSwitch({ variant = "panel", className }: AuthSwitchProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isRegister = pathname?.includes("/register");
  const mode = isRegister ? "register" : "login";
  const copy = SWITCH_COPY[mode];

  const searchString = searchParams.toString();
  const targetHref = searchString ? `${copy.href}?${searchString}` : copy.href;

  if (variant === "compact") {
    return (
      <Link
        href={targetHref}
        replace
        scroll={false}
        aria-label={copy.cta}
        className={cn(
          "group relative flex flex-col gap-4 overflow-hidden rounded-2xl bg-primary-soft p-5 text-primary-soft-foreground transition-colors hover:bg-primary-soft/80 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none sm:flex-row sm:items-center sm:justify-between",
          className,
        )}
      >
        <div className="space-y-1">
          <span className="text-xs font-semibold tracking-wider uppercase opacity-80">
            {copy.eyebrow}
          </span>
          <h3 className="font-serif text-xl font-bold tracking-tight">{copy.heading}</h3>
        </div>
        <span
          className={cn(
            buttonVariants({ variant: "default", size: "sm" }),
            "pointer-events-none gap-2 self-start group-hover:bg-primary/90 sm:self-auto",
          )}
        >
          {copy.cta}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </Link>
    );
  }

  return (
    <Link
      href={targetHref}
      replace
      scroll={false}
      aria-label={copy.cta}
      className={cn(
        "group relative hidden h-full w-full flex-col items-center justify-center overflow-hidden bg-primary-soft p-10 text-primary-soft-foreground transition-colors hover:bg-primary-soft/80 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none lg:flex xl:p-12",
        className,
      )}
    >
      {/* Background decoration */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 -right-20 size-72 rounded-full bg-primary/15 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 size-80 -translate-x-1/3 translate-y-1/3 rounded-full bg-primary/15 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 [background-image:radial-gradient(circle_at_1px_1px,currentColor_1px,transparent_0)] [background-size:16px_16px] opacity-[0.06]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 -bottom-10 rotate-12 text-primary-soft-foreground/15"
      >
        <Dice5 className="size-64" />
      </div>

      {/* Centered content block */}
      <div className="relative flex max-w-sm flex-col items-center gap-6 text-center">
        <div className="space-y-2">
          <span className="text-xs font-semibold tracking-widest uppercase opacity-80">
            {copy.eyebrow}
          </span>
          <h2 className="font-serif text-4xl leading-tight font-bold tracking-tight text-balance">
            {copy.heading}
          </h2>
        </div>

        <p className="text-sm leading-relaxed opacity-90">{copy.body}</p>

        <div className="w-full">
          <span
            className={cn(
              buttonVariants({ variant: "default", size: "lg" }),
              "pointer-events-none w-full justify-between group-hover:bg-primary/90",
            )}
          >
            {copy.cta}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  );
}
