"use client";

import { useState } from "react";

import { VOUCHER_ERROR_MESSAGES } from "@/constants/checkout";
import { VoucherError, validateVoucher } from "@/services/vouchers";
import { formatVnd } from "@/lib/format";
import type { AppliedVoucher } from "@/types/checkout";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface VoucherFieldProps {
  accountId: string;
  subtotal: number;
  applied: AppliedVoucher | null;
  onApply: (voucher: AppliedVoucher) => void;
  onRemove: () => void;
}

export function VoucherField({
  accountId,
  subtotal,
  applied,
  onApply,
  onRemove,
}: VoucherFieldProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  async function handleApply() {
    const normalized = code.trim().toUpperCase();
    if (!normalized) {
      setError("Please enter a voucher code.");
      return;
    }

    setIsApplying(true);
    setError(null);
    try {
      const voucher = await validateVoucher({ code: normalized, subtotal, accountId });
      onApply(voucher);
      setCode("");
    } catch (err) {
      if (err instanceof VoucherError) {
        setError(VOUCHER_ERROR_MESSAGES[err.code]);
      } else {
        setError("Could not validate voucher. Please try again.");
      }
    } finally {
      setIsApplying(false);
    }
  }

  function handleRemove() {
    setError(null);
    setCode("");
    onRemove();
  }

  return (
    <FieldSet>
      <FieldLegend>Voucher</FieldLegend>
      {applied ? (
        <div className="flex items-center justify-between gap-3 rounded-lg border p-3">
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-medium">{applied.code}</span>
            <span className="text-sm text-muted-foreground">
              {applied.percent}% off · Save {formatVnd(applied.discountAmount)}
            </span>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={handleRemove}>
            Remove
          </Button>
        </div>
      ) : (
        <FieldGroup className="gap-2">
          <Field>
            <FieldLabel htmlFor="voucher-code">Voucher code</FieldLabel>
            <div className="flex gap-2">
              <Input
                id="voucher-code"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Enter code"
                autoComplete="off"
                disabled={isApplying}
              />
              <Button type="button" variant="outline" onClick={handleApply} disabled={isApplying}>
                {isApplying ? "Applying..." : "Apply"}
              </Button>
            </div>
            {error ? <FieldError>{error}</FieldError> : null}
          </Field>
        </FieldGroup>
      )}
    </FieldSet>
  );
}
