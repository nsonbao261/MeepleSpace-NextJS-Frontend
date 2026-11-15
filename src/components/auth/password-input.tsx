"use client";

import * as React from "react";
import { useState } from "react";
import { EyeIcon, EyeOffIcon, LockIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthField, AuthFieldProps } from "./auth-field";

export interface PasswordInputProps extends Omit<AuthFieldProps, "icon" | "trailing" | "label"> {
  label?: string;
  error?: string;
}

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label = "Mật khẩu", error, autoComplete = "current-password", ...props }, ref) => {
    const [show, setShow] = useState(false);

    return (
      <AuthField
        ref={ref}
        label={label}
        error={error}
        type={show ? "text" : "password"}
        autoComplete={autoComplete}
        icon={<LockIcon className="h-4 w-4" />}
        trailing={
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-11 w-11 text-muted-foreground hover:text-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
            onClick={() => setShow(!show)}
            aria-label={show ? "Hide password" : "Show password"}
          >
            {show ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
          </Button>
        }
        {...props}
      />
    );
  },
);

PasswordInput.displayName = "PasswordInput";
