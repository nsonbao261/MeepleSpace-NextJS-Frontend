"use client";

import { useForm, useWatch, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams, useRouter } from "next/navigation";
import { Mail } from "lucide-react";
import { isSafeNextPath } from "@/lib/safe-next";
import { loginSchema } from "@/schemas/auth";
import { login } from "@/services/auth";
import { useSessionStore } from "@/store/session-store";
import { setRefreshCookie } from "@/lib/session-cookie";
import { useRedirectIfAuthenticated } from "@/hooks/use-redirect-if-authenticated";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/toast";
import { AuthField } from "@/components/auth/auth-field";
import { PasswordInput } from "@/components/auth/password-input";
import { GoogleButton } from "@/components/auth/google-button";
import Link from "next/link";
import { z } from "zod";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setSession = useSessionStore((s) => s.setSession);
  useRedirectIfAuthenticated();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
    defaultValues: { email: "", password: "", rememberMe: true },
  });
  const rememberMe = useWatch({ control: form.control, name: "rememberMe" });

  async function onSubmit(data: z.infer<typeof loginSchema>) {
    try {
      const session = await login(data);
      setRefreshCookie(session.refreshToken, data.rememberMe);
      setSession(session.user, session.accessToken);

      const next = searchParams.get("next");
      router.replace(isSafeNextPath(next) ? next! : "/");
    } catch {
      toast.add({ title: "Invalid email or password", type: "error" });
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-1">
        <span className="text-xs font-semibold tracking-wider text-primary uppercase">
          Welcome back
        </span>
        <h1 className="text-2xl font-semibold tracking-tight">Log in</h1>
        <p className="text-sm text-muted-foreground">
          Enter your credentials to access your account
        </p>
      </div>

      <div className="space-y-4">
        <AuthField
          {...form.register("email")}
          label="Email"
          type="email"
          placeholder="name@example.com"
          icon={<Mail className="size-4" />}
          error={form.formState.errors.email?.message}
        />

        <PasswordInput
          {...form.register("password")}
          label="Password"
          placeholder="••••••••"
          error={form.formState.errors.password?.message}
        />
      </div>

      <div className="flex items-center justify-between">
        <Controller
          control={form.control}
          name="rememberMe"
          render={({ field }) => (
            <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <Checkbox
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(checked === true)}
              />
              Remember me
            </label>
          )}
        />
        <Link href="/forgot-password" className="text-sm font-medium text-primary hover:underline">
          Forgot password?
        </Link>
      </div>

      <Button
        type="submit"
        className="h-11 w-full rounded-xl font-medium"
        disabled={form.formState.isSubmitting}
      >
        {form.formState.isSubmitting ? "Logging in..." : "Log in"}
      </Button>

      <div className="relative my-6 text-center text-xs text-muted-foreground uppercase">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <span className="relative bg-background px-3 font-medium text-muted-foreground">
          Or continue with
        </span>
      </div>

      <GoogleButton rememberMe={rememberMe} />
    </form>
  );
}
