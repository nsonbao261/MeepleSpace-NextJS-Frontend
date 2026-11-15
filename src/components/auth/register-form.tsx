"use client";

import { useForm, useWatch, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams, useRouter } from "next/navigation";
import { Mail, User, Calendar } from "lucide-react";
import { registerSchema } from "@/schemas/auth";
import { register, AuthError } from "@/services/auth";
import { useSessionStore } from "@/store/session-store";
import { setRefreshCookie } from "@/lib/session-cookie";
import { isSafeNextPath } from "@/lib/safe-next";
import { useRedirectIfAuthenticated } from "@/hooks/use-redirect-if-authenticated";
import { Button } from "@/components/ui/button";
import { Select, SelectItem } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/toast";
import { AuthField } from "@/components/auth/auth-field";
import { PasswordInput } from "@/components/auth/password-input";
import { PasswordStrength } from "@/components/auth/password-strength";
import { AvatarField } from "@/components/auth/avatar-field";
import { z } from "zod";
import Link from "next/link";

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setSession = useSessionStore((s) => s.setSession);
  useRedirectIfAuthenticated();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
    defaultValues: {
      email: "",
      password: "",
      passwordConfirmation: "",
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "prefer-not-to-say",
      termsAccepted: false as unknown as true,
    },
  });

  const firstName = useWatch({ control: form.control, name: "firstName" });
  const lastName = useWatch({ control: form.control, name: "lastName" });
  const password = useWatch({ control: form.control, name: "password" });

  async function onSubmit(data: z.infer<typeof registerSchema>) {
    const registerData = {
      email: data.email,
      password: data.password,
      passwordConfirmation: data.passwordConfirmation,
      firstName: data.firstName,
      lastName: data.lastName,
      name: `${data.firstName} ${data.lastName}`,
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      avatarUrl: data.avatarUrl,
      termsAccepted: data.termsAccepted,
    };

    try {
      const session = await register(registerData);
      setRefreshCookie(session.refreshToken, true);
      setSession(session.user, session.accessToken);

      const next = searchParams.get("next");
      router.replace(isSafeNextPath(next) ? next! : "/");
    } catch (error) {
      if (error instanceof AuthError && error.code === "email-taken") {
        form.setError("email", { type: "server", message: "This email is already in use" });
        return;
      }
      toast.add({ title: "Registration failed", type: "error" });
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <span className="text-xs font-semibold tracking-wider text-primary uppercase">
          Start your journey
        </span>
        <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
        <p className="text-sm text-muted-foreground">
          Enter your details to join the MeepleSpace community
        </p>
      </div>

      {/* Group 1: Account */}
      <div className="space-y-4">
        <div className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          Account credentials
        </div>
        <div className="space-y-4 rounded-2xl border border-border/60 bg-card/50 p-4">
          <AuthField
            {...form.register("email")}
            label="Email"
            type="email"
            placeholder="name@example.com"
            autoComplete="email"
            icon={<Mail className="size-4" />}
            error={form.formState.errors.email?.message}
          />

          <div className="space-y-2">
            <PasswordInput
              {...form.register("password")}
              label="Password"
              placeholder="••••••••"
              autoComplete="new-password"
              error={form.formState.errors.password?.message}
            />
            <PasswordStrength value={password || ""} />
          </div>

          <PasswordInput
            {...form.register("passwordConfirmation")}
            label="Confirm Password"
            placeholder="••••••••"
            autoComplete="new-password"
            error={form.formState.errors.passwordConfirmation?.message}
          />
        </div>
      </div>

      {/* Group 2: Profile */}
      <div className="space-y-4">
        <div className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          Personal profile
        </div>
        <div className="space-y-4 rounded-2xl border border-border/60 bg-card/50 p-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <AuthField
              {...form.register("firstName")}
              label="First Name"
              placeholder="Nguyen"
              autoComplete="given-name"
              icon={<User className="size-4" />}
              error={form.formState.errors.firstName?.message}
            />
            <AuthField
              {...form.register("lastName")}
              label="Last Name"
              placeholder="An"
              autoComplete="family-name"
              icon={<User className="size-4" />}
              error={form.formState.errors.lastName?.message}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <AuthField
              {...form.register("dateOfBirth")}
              label="Date of Birth"
              type="date"
              autoComplete="bday"
              icon={<Calendar className="size-4" />}
              error={form.formState.errors.dateOfBirth?.message}
            />

            <div className="space-y-1.5">
              <label className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Gender
              </label>
              <Controller
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="non-binary">Non-binary</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                  </Select>
                )}
              />
              {form.formState.errors.gender && (
                <p className="text-xs text-destructive">{form.formState.errors.gender.message}</p>
              )}
            </div>
          </div>

          <AvatarField
            name={`${firstName || ""} ${lastName || ""}`}
            onChange={(url) => form.setValue("avatarUrl", url)}
            error={form.formState.errors.avatarUrl?.message}
          />
        </div>
      </div>

      {/* Group 3: Consent */}
      <div className="space-y-4">
        <div className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          Terms &amp; Consent
        </div>
        <div className="space-y-2 rounded-2xl border border-border/60 bg-card/50 p-4">
          <Controller
            control={form.control}
            name="termsAccepted"
            render={({ field }) => (
              <label className="flex cursor-pointer items-start gap-3 text-sm text-muted-foreground hover:text-foreground">
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(checked === true)}
                  className="mt-0.5"
                />
                <span>
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    target="_blank"
                    className="font-medium text-primary hover:underline"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    target="_blank"
                    className="font-medium text-primary hover:underline"
                  >
                    Privacy Policy
                  </Link>
                </span>
              </label>
            )}
          />
          {form.formState.errors.termsAccepted && (
            <p className="text-xs font-medium text-destructive">
              {form.formState.errors.termsAccepted.message}
            </p>
          )}
        </div>
      </div>

      <Button
        type="submit"
        className="h-11 w-full rounded-xl font-medium"
        disabled={form.formState.isSubmitting}
      >
        {form.formState.isSubmitting ? "Creating account..." : "Create account"}
      </Button>
    </form>
  );
}
