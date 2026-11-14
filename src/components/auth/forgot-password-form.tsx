"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { forgotPasswordSchema } from "@/schemas/auth";
import { requestPasswordReset } from "@/services/auth";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldContent, FieldError } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { z } from "zod";

export function ForgotPasswordForm() {
  const router = useRouter();

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(data: z.infer<typeof forgotPasswordSchema>) {
    await requestPasswordReset(data.email);
    toast.add({ title: "If an account exists, a reset link has been sent." });
    router.push(`/reset-password?email=${encodeURIComponent(data.email)}`);
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <h1 className="text-xl font-semibold">Forgot Password</h1>
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
      <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? "Sending..." : "Send Reset Link"}
      </Button>
    </form>
  );
}
