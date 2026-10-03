"use client";

import * as React from "react";
import {
  useFormContext,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

import {
  Field,
  FieldDescription,
  FieldError as FieldErrorSlot,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

/**
 * The one place the RHF field idiom is written down, for the reason in A-3:
 * `field.tsx` links nothing to its input. `FieldError` is a bare
 * `role="alert"` div, `FieldLabel` is a plain `<label>` that associates by
 * `htmlFor` and nothing else, and there is no `Form` or `FieldControl` in the
 * base-nova line to wire them. Four forms that each hand-roll this markup are
 * exactly how `autocomplete`, `aria-invalid`, and `aria-describedby` end up
 * inconsistent between routes.
 *
 * The id scheme lives here rather than at the call sites for the same reason:
 *
 *   id            -> "email"          (the field name, so it is stable and greppable)
 *   descriptionId -> "email-description"
 *   errorId       -> "email-error"
 *
 * `aria-describedby` joins whichever of those two ids actually exist, so it
 * never carries a dangling reference to an error slot that rendered nothing.
 */

/**
 * Structural, not RHF's `FieldError`. `formState.errors[name]` widens to
 * `FieldError | Merge<FieldError, FieldErrorsImpl<…>> | undefined`, and
 * naming either one here would tie this helper to RHF's internal merge shape
 * for the sake of two optional properties.
 */
type ErrorLike = {
  message?: unknown;
  types?: Record<string, unknown> | undefined;
};

/** `types` is populated only when the form uses `criteriaMode: "all"`. */
function errorMessages(error: ErrorLike | undefined) {
  if (!error) return [];

  // Zod can report several issues on one field — a short password that is also
  // missing a digit, say — and `toNestErrors` keeps them all in `types` rather
  // than letting them overwrite one another. They reach the user as `FieldError`'s
  // `<ul>`, which is what its dedupe + list branch is for. `types` is absent
  // without `criteriaMode: "all"`, in which case `message` is all there is.
  const fromTypes = Object.values(error.types ?? {})
    .map((value) => (Array.isArray(value) ? value[0] : value))
    .filter((value): value is string => typeof value === "string");

  if (fromTypes.length > 0) return fromTypes.map((message) => ({ message }));

  return typeof error.message === "string" ? [{ message: error.message }] : [];
}

type FieldShellProps<TFieldValues extends FieldValues> = {
  name: FieldPath<TFieldValues>;
  label: string;
  /**
   * Required and not defaulted. A field with no `autocomplete` is a bug here
   * rather than an omission (§5.3, §5.4, §5.7): without it a password manager
   * will not offer to generate or save anything, and the sign-in form is the
   * worst place to discover that.
   */
  autoComplete: string;
  description?: React.ReactNode;
  /** Never the label. Placeholder text is not an accessible name (§9). */
  placeholder?: string;
  type?: React.ComponentProps<"input">["type"];
  inputMode?: React.ComponentProps<"input">["inputMode"];
  autoFocus?: boolean;
  disabled?: boolean;
  /** An absolutely-positioned control inside the input's right edge, e.g. the password toggle. */
  trailing?: React.ReactNode;
};

export function FieldShell<TFieldValues extends FieldValues>({
  name,
  label,
  autoComplete,
  description,
  placeholder,
  type = "text",
  inputMode,
  autoFocus,
  disabled,
  trailing,
}: FieldShellProps<TFieldValues>) {
  const { register, formState } = useFormContext<TFieldValues>();
  const error = formState.errors[name];
  const messages = errorMessages(error);

  const id = name;
  const descriptionId = `${id}-description`;
  const errorId = `${id}-error`;

  const describedBy = [
    description ? descriptionId : null,
    messages.length > 0 ? errorId : null,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    // `data-invalid` is a literal string, not a boolean: the vendored variant is
    // `data-[invalid=true]:text-destructive`, and `data-invalid={false}` would
    // render `data-invalid="false"`, which the variant does not match.
    <Field data-invalid={error ? "true" : undefined}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>

      <div className="relative">
        <Input
          id={id}
          type={type}
          autoComplete={autoComplete}
          placeholder={placeholder}
          inputMode={inputMode}
          autoFocus={autoFocus}
          disabled={disabled}
          // The invalid state is reached here and nowhere else. The border and
          // ring already live in `Input`'s base string behind `aria-invalid:`
          // (`input.tsx:11`), so writing a colour at the call site would be a
          // §7.2 breach and would fight tailwind-merge.
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy || undefined}
          // Decision 20: `h-11` against the vendored `h-8`. A sizing utility, not
          // a token, and no colour is touched. The override is at the call site
          // on purpose — `src/components/ui/` may not be hand-edited.
          className={trailing ? "h-11 pr-11" : "h-11"}
          {...register(name)}
        />

        {trailing ? (
          <div className="absolute inset-y-0 right-0 flex items-center pr-1">
            {trailing}
          </div>
        ) : null}
      </div>

      {description ? (
        <FieldDescription id={descriptionId}>{description}</FieldDescription>
      ) : null}

      {/* `FieldError` returns `null` when it has no content, so this is always
          rendered rather than conditionally. It spreads `id` onto its div, which
          is what makes `aria-describedby` above resolve. */}
      <FieldErrorSlot id={errorId} errors={messages} />
    </Field>
  );
}
