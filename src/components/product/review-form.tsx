"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { ReviewRatingInput } from "@/components/product/review-rating-input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { REVIEW_BODY_MAX_LENGTH } from "@/constants";
import { useAuthGateStore, useSessionStore } from "@/store";

const reviewSchema = z.object({
  rating: z
    .number()
    .int()
    .min(1, "Choose a star rating")
    .max(5, "Choose a star rating between 1 and 5"),
  body: z
    .string()
    .max(
      REVIEW_BODY_MAX_LENGTH,
      `Keep your review under ${REVIEW_BODY_MAX_LENGTH.toLocaleString()} characters.`,
    )
    .optional(),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
  productSlug: string;
}

export function ReviewForm({ productSlug }: ReviewFormProps) {
  const role = useSessionStore((state) => state.role);
  const openGate = useAuthGateStore((state) => state.openGate);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 5, body: "" },
  });

  const body = useWatch({ control, name: "body" }) ?? "";

  function onSubmit() {
    // UI-only: validate, toast and reset. The list and summary never change.
    toast.add({
      type: "success",
      title: "Review submitted",
      description: "Thank you! Your review has been recorded.",
    });
    reset({ rating: 5, body: "" });
  }

  if (role === "guest") {
    return (
      <div className="rounded-2xl border bg-card p-6">
        <h3 className="mb-4 text-lg font-semibold">Write a review</h3>
        <div className="flex flex-col items-center justify-between gap-4 rounded-xl border border-dashed p-4 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            Please log in to submit your rating and review.
          </p>
          <Button onClick={() => openGate("review", `/products/${productSlug}`)}>
            Log in to review
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border bg-card p-6">
      <h3 className="mb-4 text-lg font-semibold">Write a review</h3>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <Controller
          control={control}
          name="rating"
          render={({ field, fieldState }) => (
            <ReviewRatingInput
              name={field.name}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={fieldState.error?.message}
            />
          )}
        />

        <div className="flex flex-col gap-1.5">
          <label htmlFor="review-body" className="text-sm font-medium">
            Your review (optional)
          </label>
          <Textarea
            id="review-body"
            rows={4}
            placeholder="Share your thoughts about components, gameplay, rules clarity..."
            aria-invalid={errors.body ? true : undefined}
            aria-describedby={errors.body ? "review-body-error" : undefined}
            {...register("body")}
          />
          <div className="flex items-start justify-between gap-3">
            {errors.body ? (
              <p id="review-body-error" role="alert" className="text-sm text-destructive">
                {errors.body.message}
              </p>
            ) : (
              <span />
            )}
            <span
              className={`text-right text-xs tabular-nums ${
                body.length > REVIEW_BODY_MAX_LENGTH ? "text-destructive" : "text-muted-foreground"
              }`}
            >
              {body.length}/{REVIEW_BODY_MAX_LENGTH} characters
            </span>
          </div>
        </div>

        <Button type="submit" className="min-h-11 self-end px-6">
          Submit review
        </Button>
      </form>
    </div>
  );
}
