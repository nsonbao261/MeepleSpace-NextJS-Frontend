import * as React from "react";
import { cn } from "@/lib/utils";

export type PasswordStrengthLevel = 0 | 1 | 2 | 3 | 4;

export function getPasswordStrength(value: string): PasswordStrengthLevel {
  if (!value) return 0;

  let score = 0;
  if (value.length >= 8) score++;
  if (value.length >= 12) score++;
  if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score++;
  else if (/[a-zA-Z]/.test(value) && /[0-9]/.test(value)) score++;
  if (/[^a-zA-Z0-9]/.test(value)) score++;

  if (score > 4) score = 4;
  return score as PasswordStrengthLevel;
}

export interface PasswordStrengthProps {
  value: string;
  className?: string;
}

const STRENGTH_LABELS: Record<PasswordStrengthLevel, string> = {
  0: "",
  1: "Yếu",
  2: "Trung bình",
  3: "Khởi sắc",
  4: "Mạnh",
};

const STRENGTH_COLORS: Record<PasswordStrengthLevel, string> = {
  0: "bg-muted",
  1: "bg-destructive/80",
  2: "bg-amber-500",
  3: "bg-blue-500",
  4: "bg-emerald-500",
};

export function PasswordStrength({ value, className }: PasswordStrengthProps) {
  if (!value) return null;

  const strength = getPasswordStrength(value);
  const label = STRENGTH_LABELS[strength];

  return (
    <div className={cn("flex flex-col gap-1.5", className)} aria-live="polite">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Độ mạnh mật khẩu:</span>
        <span className="font-medium text-foreground">{label}</span>
      </div>
      <div className="grid h-1.5 w-full grid-cols-4 gap-1.5">
        {([1, 2, 3, 4] as const).map((level) => (
          <div
            key={level}
            className={cn(
              "h-full rounded-full transition-colors duration-200",
              strength >= level ? STRENGTH_COLORS[strength] : "bg-muted",
            )}
          />
        ))}
      </div>
    </div>
  );
}
