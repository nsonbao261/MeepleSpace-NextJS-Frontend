"use client";

import { useForm, useWatch, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams, useRouter } from "next/navigation";
import { isSafeNextPath } from "@/lib/safe-next";
import { loginSchema } from "@/schemas/auth";
import { login } from "@/services/auth";
import { useSessionStore } from "@/store/session-store";
import { setRefreshCookie } from "@/lib/session-cookie";
import { useRedirectIfAuthenticated } from "@/hooks/use-redirect-if-authenticated";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel, FieldContent, FieldError } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
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
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <h1 className="text-xl font-semibold">Log in</h1>
      <Field>
        <FieldLabel>
          <Label>Email</Label>
          <FieldContent>
            <Input {...form.register("email")} type="email" />
          </FieldContent>
          {form.formState.errors.email && (
            <FieldError>{form.formState.errors.email.message}</FieldError>
          )}
        </FieldLabel>
      </Field>
      <PasswordInput
        {...form.register("password")}
        label="Password"
        error={form.formState.errors.password?.message}
      />
      <div className="flex items-center justify-between">
        <Controller
          control={form.control}
          name="rememberMe"
          render={({ field }) => (
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <Checkbox
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(checked === true)}
              />
              Remember me
            </label>
          )}
        />
        <Link href="/forgot-password" className="text-sm text-primary hover:underline">
          Forgot password?
        </Link>
      </div>
      <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? "Logging in..." : "Log in"}
      </Button>
      <div className="relative text-center text-xs text-muted-foreground uppercase">
        <span className="bg-background px-2">Or</span>
      </div>
      <GoogleButton rememberMe={rememberMe} />
      <p className="text-center text-sm">
        Do not have an account?
        <Link href="/register" className="text-primary hover:underline">
          Sign up
        </Link>
      </p>
    </form>
  );
}
