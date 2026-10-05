import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { cn } from "@/lib/utils";

export type AuthMode = "signin" | "register";

const MODES = [
  { mode: "signin", href: "/login", label: "Sign in" },
  { mode: "register", href: "/register", label: "Create account" },
] as const;

export function AuthSwitcher({ active }: { active: AuthMode }) {
  return (
    <ButtonGroup aria-label="Sign in or create an account" className="w-full">
      {MODES.map(({ mode, href, label }) => {
        const current = mode === active;

        return (
          <Link
            key={mode}
            href={href}
            data-slot="button"
            aria-current={current ? "page" : undefined}
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "h-11 flex-1",
              current && "bg-muted text-foreground",
            )}
          >
            {label}
          </Link>
        );
      })}
    </ButtonGroup>
  );
}
