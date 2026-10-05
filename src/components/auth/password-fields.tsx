"use client";

import * as React from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";

import { FieldShell } from "@/components/auth/field-shell";
import { Button } from "@/components/ui/button";
import { PASSWORD_RULE } from "@/lib/auth-schemas";

type PasswordFieldsProps = {
  intent: "new" | "current";

  confirm?: boolean;
};

export function PasswordFields({
  intent,
  confirm = true,
}: PasswordFieldsProps) {
  const [visible, setVisible] = React.useState(false);
  const type = visible ? "text" : "password";

  const toggle = (subject: string) => (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={() => setVisible((value) => !value)}

      aria-label={`${visible ? "Hide" : "Show"} ${subject}`}
    >
      {visible ? <EyeOffIcon /> : <EyeIcon />}
    </Button>
  );

  return (
    <>
      <FieldShell
        name="password"
        label="Password"
        autoComplete={intent === "new" ? "new-password" : "current-password"}
        type={type}
        trailing={toggle("password")}

        description={intent === "new" ? PASSWORD_RULE : undefined}
      />

      {confirm ? (
        <FieldShell
          name="confirmPassword"
          label="Confirm password"
          autoComplete="new-password"
          type={type}
          trailing={toggle("password confirmation")}
        />
      ) : null}
    </>
  );
}
