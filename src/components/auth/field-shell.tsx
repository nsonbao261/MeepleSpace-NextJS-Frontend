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

type ErrorLike = {
  message?: unknown;
  types?: Record<string, unknown> | undefined;
};

function errorMessages(error: ErrorLike | undefined) {
  if (!error) return [];

  const fromTypes = Object.values(error.types ?? {})
    .map((value) => (Array.isArray(value) ? value[0] : value))
    .filter((value): value is string => typeof value === "string");

  if (fromTypes.length > 0) return fromTypes.map((message) => ({ message }));

  return typeof error.message === "string" ? [{ message: error.message }] : [];
}

type FieldShellProps<TFieldValues extends FieldValues> = {
  name: FieldPath<TFieldValues>;
  label: string;

  autoComplete: string;
  description?: React.ReactNode;

  placeholder?: string;
  type?: React.ComponentProps<"input">["type"];
  inputMode?: React.ComponentProps<"input">["inputMode"];
  autoFocus?: boolean;
  disabled?: boolean;

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

          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy || undefined}

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

      {}
      <FieldErrorSlot id={errorId} errors={messages} />
    </Field>
  );
}
