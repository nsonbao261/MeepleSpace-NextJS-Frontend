"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams, useRouter } from "next/navigation";
import { resetPasswordSchema } from "@/schemas/auth";
import { resetPassword } from "@/services/auth";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldContent } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { PasswordInput } from "@/components/auth/password-input";
import { z } from "zod";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email, password: "", passwordConfirmation: "" },
  });

  async function onSubmit(data: z.infer<typeof resetPasswordSchema>) {
    await resetPassword(data);
    toast.add({ title: "Password reset successful" });
    router.push("/login");
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <h1 className="text-xl font-semibold">Reset Password</h1>
      <Field>
        <FieldLabel>
          <Label>Email</Label>
          <FieldContent>
            <Input {...form.register("email")} type="email" disabled />
          </FieldContent>
        </FieldLabel>
      </Field>
      <PasswordInput
        {...form.register("password")}
        label="New Password"
        autoComplete="new-password"
        error={form.formState.errors.password?.message}
      />
      <PasswordInput
        {...form.register("passwordConfirmation")}
        label="Confirm Password"
        autoComplete="new-password"
        error={form.formState.errors.passwordConfirmation?.message}
      />
      <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? "Resetting..." : "Reset Password"}
      </Button>
    </form>
  );
}
