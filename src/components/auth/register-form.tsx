"use client";

import { useForm, useWatch, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams, useRouter } from "next/navigation";
import { registerSchema } from "@/schemas/auth";
import { register, AuthError } from "@/services/auth";
import { useSessionStore } from "@/store/session-store";
import { setRefreshCookie } from "@/lib/session-cookie";
import { isSafeNextPath } from "@/lib/safe-next";
import { useRedirectIfAuthenticated } from "@/hooks/use-redirect-if-authenticated";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldContent, FieldError } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectItem } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/toast";
import { PasswordInput } from "@/components/auth/password-input";
import { AvatarField } from "@/components/auth/avatar-field";
import { z } from "zod";

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setSession = useSessionStore((s) => s.setSession);
  useRedirectIfAuthenticated();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
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
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <h1 className="text-xl font-semibold">Create Account</h1>
      <div className="grid grid-cols-2 gap-4">
        <Field>
          <FieldLabel>
            <Label>First Name</Label>
            <FieldContent>
              <Input {...form.register("firstName")} />
            </FieldContent>
            {form.formState.errors.firstName && (
              <FieldError>{form.formState.errors.firstName.message}</FieldError>
            )}
          </FieldLabel>
        </Field>
        <Field>
          <FieldLabel>
            <Label>Last Name</Label>
            <FieldContent>
              <Input {...form.register("lastName")} />
            </FieldContent>
            {form.formState.errors.lastName && (
              <FieldError>{form.formState.errors.lastName.message}</FieldError>
            )}
          </FieldLabel>
        </Field>
      </div>
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
        autoComplete="new-password"
        error={form.formState.errors.password?.message}
      />
      <PasswordInput
        {...form.register("passwordConfirmation")}
        label="Confirm Password"
        autoComplete="new-password"
        error={form.formState.errors.passwordConfirmation?.message}
      />
      <Field>
        <FieldLabel>
          <Label>Date of Birth</Label>
          <FieldContent>
            <Input {...form.register("dateOfBirth")} type="date" />
          </FieldContent>
          {form.formState.errors.dateOfBirth && (
            <FieldError>{form.formState.errors.dateOfBirth.message}</FieldError>
          )}
        </FieldLabel>
      </Field>
      <Field>
        <FieldLabel>
          <Label>Gender</Label>
          <FieldContent>
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
          </FieldContent>
          {form.formState.errors.gender && (
            <FieldError>{form.formState.errors.gender.message}</FieldError>
          )}
        </FieldLabel>
      </Field>
      <AvatarField
        name={`${firstName} ${lastName}`}
        onChange={(url) => form.setValue("avatarUrl", url)}
        error={form.formState.errors.avatarUrl?.message}
      />
      <Controller
        control={form.control}
        name="termsAccepted"
        render={({ field }) => (
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <Checkbox
              checked={field.value}
              onCheckedChange={(checked) => field.onChange(checked === true)}
            />
            I agree to the Terms and Privacy Policy
          </label>
        )}
      />
      {form.formState.errors.termsAccepted && (
        <p className="text-sm text-destructive">{form.formState.errors.termsAccepted.message}</p>
      )}
      <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? "Creating account..." : "Sign up"}
      </Button>
    </form>
  );
}
