import { Metadata } from "next";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Set a new password for your MeepleSpace account",
};

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}
