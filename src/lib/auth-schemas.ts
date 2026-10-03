import { z } from "zod";

/**
 * Shared rules and the four form schemas. This module is pure: it does not
 * import the auth store, so it stays importable from a client component without
 * dragging a persisted store behind a validator. Register's uniqueness check is
 * therefore composed at the call site, not here — see the last note below.
 *
 * English, sentence case, no emoji (§7.3).
 */

/**
 * A-2: the `pipe` form, not `z.email().trim()`. In zod 4.6.5 `z.email()`
 * registers its format check at construction and `.trim()` registers after it,
 * so the format is validated against the *untrimmed* string and
 * `"  Ada@Example.COM "` is rejected. Piping validates last, after both
 * transforms, and yields the trimmed and lowercased address.
 */
export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email({ error: "Enter a valid email address." }));

/**
 * The rule, and the text that states it. Exported so `password-fields.tsx` shows
 * this string and the rules below can never drift from it. Stated as help text
 * *before* the first failed submit, not only as an error afterwards.
 */
export const PASSWORD_RULE =
  "At least 8 characters, including one letter and one number.";

/**
 * Deliberately **not** `.trim()`, unlike every other string in this file.
 * Trimming a password silently rewrites the credential, so the value stored at
 * registration and the value typed at sign-in can differ by invisible
 * characters and the account becomes unopenable. Leading and trailing spaces are
 * therefore part of the secret — which is also why `PASSWORD_RULE` counts
 * characters as typed.
 */
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

/** A leading `0` or `+84` then nine digits. §4.5. */
const VIETNAMESE_MOBILE = /^(?:\+84|0)\d{9}$/;

/**
 * `string | undefined` in, `string | null` out, so a blank input is `null` and
 * never `""` (EC-9) and `+84` is normalised to a leading `0` so one number is
 * not stored twice. The regex is checked *after* the normalisation, which is why
 * it only ever has to accept the canonical spelling.
 */
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

/** Round-trips through `Date.UTC` so `2026-02-30` cannot pass. */
function isRealCalendarDate(value: string): boolean {
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

/**
 * Optional, a real calendar date, never in the future. `string | undefined` in,
 * `string | null` out, so a blank input is `null` (EC-10).
 *
 * There is deliberately **no age threshold.** The brief asked for "16 or older"
 * and it is not implemented: a board game shop has no age gate, and putting an
 * arbitrary minimum in the contract is a rule the backend would have to honour.
 * Decision 10, not an oversight — re-adding one is a schema change the backend
 * drives, not a UI change (F-8).
 */
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

/**
 * The password pair, shared by `/register` and `/reset-password` so the two
 * routes cannot drift apart on the field definitions.
 */
const passwordPair = {
  password: passwordSchema,
  confirmPassword: z.string().min(1, { error: "Confirm your password." }),
};

/**
 * `confirmPassword` is a refinement and nothing else: never a `User` field,
 * never persisted, never sent anywhere. The predicate and the message are
 * shared rather than factored through a generic, because a generic over
 * `ZodRawShape` cannot prove the two keys exist and the compiler is right to
 * refuse it. Two spreads and one shared message give the same guarantee.
 */
const confirmationsMatch = (data: {
  password: string;
  confirmPassword: string;
}) => data.confirmPassword === data.password;

const PASSWORD_MISMATCH = {
  error: "Passwords do not match.",
  path: ["confirmPassword"],
};

/** No strength check at login (§5.4): refusing a short password at sign-in is wrong once the rule changes. */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, { error: "Enter your password." }),
});

/** Field order is D-4's: email first, both optionals last. DOM order is the tab order (§9). */
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

/** Both fields are new-password, so the browser offers to generate and save. */
export const resetPasswordSchema = z
  .object(passwordPair)
  .refine(confirmationsMatch, PASSWORD_MISMATCH);

/**
 * Input types, exported so no call site writes `useForm`'s three generics by
 * hand (A-2). `useForm<RegisterInput, unknown, RegisterOutput>` — using
 * `z.infer` instead would type the form as the *output* and silently drop the
 * email trim/lowercase and the `+84` normalisation.
 */
export type LoginInput = z.input<typeof loginSchema>;
export type LoginOutput = z.output<typeof loginSchema>;
export type RegisterInput = z.input<typeof registerSchema>;
export type RegisterOutput = z.output<typeof registerSchema>;
export type ForgotPasswordInput = z.input<typeof forgotPasswordSchema>;
export type ForgotPasswordOutput = z.output<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.input<typeof resetPasswordSchema>;
export type ResetPasswordOutput = z.output<typeof resetPasswordSchema>;

/**
 * Register stays pure. Uniqueness needs the store, and a schema that imports the
 * store can no longer be imported without one — so `register-form.tsx` composes
 * the refinement at submit time from `useAuthStore.getState()`:
 *
 *   registerSchema.refine(
 *     (data) => !useAuthStore.getState().findByEmail(data.email),
 *     { error: "An account with this email already exists.", path: ["email"] },
 *   );
 *
 * Verified on zod 4.6.5 that the issue is reported at `["email"]`, which is
 * what puts the message on the field rather than in a toast (EC-4, §5.10).
 * `findByEmail` normalises the address, so uniqueness is case-insensitive and
 * survives surrounding whitespace (EC-14).
 */
