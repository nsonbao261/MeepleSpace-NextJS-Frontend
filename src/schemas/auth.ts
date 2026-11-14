import { z } from "zod";
import { AUTH_CONFIG } from "@/constants/auth";

const passwordSchema = z
  .string()
  .min(AUTH_CONFIG.PASSWORD_MIN_LENGTH)
  .max(AUTH_CONFIG.PASSWORD_MAX_LENGTH);

const strongPasswordSchema = passwordSchema.refine(
  (val) => /[A-Za-z]/.test(val) && /[0-9]/.test(val),
  { message: "Password must contain at least one letter and one number" },
);

const emailSchema = z.string().trim().toLowerCase().email();

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  rememberMe: z.boolean(),
});

export const registerSchema = z
  .object({
    email: emailSchema,
    password: strongPasswordSchema,
    passwordConfirmation: strongPasswordSchema,
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    dateOfBirth: z.string().refine((val) => {
      const date = new Date(val);
      const now = new Date();
      const minAgeDate = new Date();
      minAgeDate.setFullYear(now.getFullYear() - AUTH_CONFIG.MIN_AGE);
      return !isNaN(date.getTime()) && date <= minAgeDate;
    }, "Must be at least 13 years old"),
    gender: z.enum(["male", "female", "non-binary", "prefer-not-to-say"]),
    avatarUrl: z.string().url().optional().or(z.literal("")),
    termsAccepted: z.literal(true, {
      message: "You must accept the terms and privacy policy",
    }),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  });

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z
  .object({
    email: emailSchema,
    password: strongPasswordSchema,
    passwordConfirmation: strongPasswordSchema,
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  });
