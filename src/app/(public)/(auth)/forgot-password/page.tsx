import { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your MeepleSpace password",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
