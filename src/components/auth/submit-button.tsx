"use client";

import * as React from "react";
import { useFormContext, type FieldValues } from "react-hook-form";

import { Button } from "@/components/ui/button";

type SubmitButtonProps = {
  children: React.ReactNode;

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

      className="h-11 w-full"
    >
      {}
      {isSubmitting ? pendingLabel : children}
    </Button>
  );
}
