import { z } from "zod";

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email({ error: "Enter a valid email address." }));

export const PASSWORD_RULE =
  "At least 8 characters, including one letter and one number.";

export const passwordSchema = z
  .string()
  .min(8, { error: "Use at least 8 characters." })
  .regex(/[a-zA-Z]/, { error: "Include at least one letter." })
  .regex(/[0-9]/, { error: "Include at least one number." });

const firstNameSchema = z
  .string()
  .trim()
  .min(1, { error: "Enter your first name." });

const lastNameSchema = z
  .string()
  .trim()
  .min(1, { error: "Enter your last name." });

const VIETNAMESE_MOBILE = /^(?:\+84|0)\d{9}$/;

export const phoneSchema = z
  .string()
  .trim()
  .optional()
  .transform((value) =>
    value === undefined || value === "" ? null : value.replace(/^\+84/, "0"),
  )
  .pipe(
    z
      .string()
      .regex(VIETNAMESE_MOBILE, {
        error: "Enter a mobile number like 0901234567.",
      })
      .nullable(),
  );

function isRealCalendarDate(value: string): boolean {
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export const dateOfBirthSchema = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value === undefined || value === "" ? null : value))
  .pipe(
    z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, { error: "Use the date picker." })
      .refine(isRealCalendarDate, { error: "That date does not exist." })
      .refine((value) => Date.parse(value) <= Date.now(), {
        error: "Date of birth cannot be in the future.",
      })
      .nullable(),
  );

const passwordPair = {
  password: passwordSchema,
  confirmPassword: z.string().min(1, { error: "Confirm your password." }),
};

const confirmationsMatch = (data: {
  password: string;
  confirmPassword: string;
}) => data.confirmPassword === data.password;

const PASSWORD_MISMATCH = {
  error: "Passwords do not match.",
  path: ["confirmPassword"],
};

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, { error: "Enter your password." }),
});

export const registerSchema = z
  .object({
    email: emailSchema,
    firstName: firstNameSchema,
    lastName: lastNameSchema,
    ...passwordPair,
    dateOfBirth: dateOfBirthSchema,
    phone: phoneSchema,
  })
  .refine(confirmationsMatch, PASSWORD_MISMATCH);

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z
  .object(passwordPair)
  .refine(confirmationsMatch, PASSWORD_MISMATCH);

export type LoginInput = z.input<typeof loginSchema>;
export type LoginOutput = z.output<typeof loginSchema>;
export type RegisterInput = z.input<typeof registerSchema>;
export type RegisterOutput = z.output<typeof registerSchema>;
export type ForgotPasswordInput = z.input<typeof forgotPasswordSchema>;
export type ForgotPasswordOutput = z.output<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.input<typeof resetPasswordSchema>;
export type ResetPasswordOutput = z.output<typeof resetPasswordSchema>;
