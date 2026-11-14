"use client";

import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldContent, FieldError } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface PasswordInputProps extends React.ComponentProps<typeof Input> {
  label?: string;
  error?: string;
}

export function PasswordInput({ label = "Password", error, ...props }: PasswordInputProps) {
  const [show, setShow] = useState(false);

  return (
    <Field>
      <FieldLabel>
        <Label>{label}</Label>
        <FieldContent className="relative">
          <Input
            {...props}
            type={show ? "text" : "password"}
            autoComplete={props.autoComplete ?? "current-password"}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute top-0 right-0 h-9 w-9"
            onClick={() => setShow(!show)}
          >
            {show ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
          </Button>
        </FieldContent>
        {error && <FieldError>{error}</FieldError>}
      </FieldLabel>
    </Field>
  );
}
