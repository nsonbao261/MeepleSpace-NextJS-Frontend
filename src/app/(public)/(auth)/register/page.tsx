import { Metadata } from "next";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Sign up for a new MeepleSpace account",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
