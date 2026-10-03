"use client";

import * as React from "react";
import { useFormContext, type FieldValues } from "react-hook-form";

import { Button } from "@/components/ui/button";

/**
 * The submit, written once for the same reason as `field-shell.tsx` (A-3).
 * Not a field, so it is not in that file, but it is the other half of the RHF
 * idiom: it reads `isSubmitting` out of form state and the label logic is the
 * part a form is most likely to get subtly wrong.
 *
 * §6.1 of the plan did not list this file. It is an addition — A-15.
 */
type SubmitButtonProps = {
  /** The resting label, e.g. `Sign in`. */
  children: React.ReactNode;
  /** The pending label, e.g. `Signing in…`. */
  pendingLabel: string;
  disabled?: boolean;
};

export function SubmitButton({
  children,
  pendingLabel,
  disabled,
}: SubmitButtonProps) {
  const { formState } = useFormContext<FieldValues>();
  const isSubmitting = formState.isSubmitting;

  return (
    <Button
      type="submit"
      disabled={isSubmitting || disabled}
      // `h-11` for the same reason as the inputs: the vendored `lg` is `h-9`,
      // 36px. The submit sits directly under a 44px field and a 36px button
      // between them reads as a different class of control (Decision 20).
      className="h-11 w-full"
    >
      {/* The accessible name *changes* rather than the button going quiet, so a
          screen reader says what is happening instead of nothing (§9). This is a
          single button whose name is swapped, not a disabled button plus a
          spinner — the latter leaves the name stale and the state unannounced. */}
      {isSubmitting ? pendingLabel : children}
    </Button>
  );
}
