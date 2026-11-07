"use client";

import { StarIcon } from "lucide-react";

import { cn } from "@/lib";

interface ReviewRatingInputProps {
  name: string;
  value: number;
  onChange: (value: number) => void;
  onBlur?: () => void;
  error?: string;
}

const STARS = [1, 2, 3, 4, 5] as const;

/** Accessible star radio group: native radios, arrow-key navigation and a legend. */
export function ReviewRatingInput({
  name,
  value,
  onChange,
  onBlur,
  error,
}: ReviewRatingInputProps) {
  const errorId = `${name}-error`;

  return (
    <fieldset className="flex flex-col gap-1.5">
      <legend className="mb-1.5 text-sm font-medium">Your rating</legend>
      <div className="flex items-center gap-1">
        {STARS.map((star) => (
          <label
            key={star}
            className="cursor-pointer rounded-md p-1 has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-ring/50"
          >
            <input
              type="radio"
              name={name}
              value={star}
              checked={value === star}
              onChange={() => onChange(star)}
              onBlur={onBlur}
              aria-describedby={error ? errorId : undefined}
              className="sr-only"
            />
            <StarIcon
              aria-hidden="true"
              className={cn(
                "size-6",
                star <= value ? "fill-amber-500 text-amber-500" : "text-muted-foreground",
              )}
            />
            <span className="sr-only">
              {star} star{star === 1 ? "" : "s"}
            </span>
          </label>
        ))}
      </div>
      {error && (
        <p id={errorId} role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </fieldset>
  );
}
