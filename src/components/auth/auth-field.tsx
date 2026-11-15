import * as React from "react";
import { useId } from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldDescription } from "@/components/ui/field";

export interface AuthFieldProps extends Omit<React.ComponentProps<"input">, "id"> {
  label: string;
  icon?: React.ReactNode;
  trailing?: React.ReactNode;
  error?: string;
  description?: string;
  id?: string;
}

export const AuthField = React.forwardRef<HTMLInputElement, AuthFieldProps>(
  ({ label, icon, trailing, error, description, className, id: propId, ...props }, ref) => {
    const generatedId = useId();
    const id = propId || generatedId;
    const descriptionId = description ? `${id}-description` : undefined;
    const errorId = error ? `${id}-error` : undefined;
    const ariaDescribedBy = [descriptionId, errorId].filter(Boolean).join(" ") || undefined;

    return (
      <Field data-invalid={!!error} className="gap-1.5">
        <label
          htmlFor={id}
          className="text-xs font-medium tracking-wide text-muted-foreground uppercase"
        >
          {label}
        </label>
        <div className="relative flex w-full items-center">
          {icon && (
            <div className="pointer-events-none absolute left-3.5 flex items-center justify-center text-muted-foreground">
              {icon}
            </div>
          )}
          <Input
            ref={ref}
            id={id}
            aria-invalid={!!error}
            aria-describedby={ariaDescribedBy}
            className={cn(
              "h-11 rounded-xl text-base md:text-sm",
              icon && "pl-10",
              trailing && "pr-10",
              error &&
                "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20",
              className,
            )}
            {...props}
          />
          {trailing && (
            <div className="absolute right-3.5 flex items-center justify-center text-muted-foreground">
              {trailing}
            </div>
          )}
        </div>
        {description && !error && (
          <FieldDescription id={descriptionId}>{description}</FieldDescription>
        )}
        {error && (
          <FieldError id={errorId} className="flex items-center gap-1.5 text-xs">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            <span>{error}</span>
          </FieldError>
        )}
      </Field>
    );
  },
);

AuthField.displayName = "AuthField";
