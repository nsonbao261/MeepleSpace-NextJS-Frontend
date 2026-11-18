"use client";

import { DELIVERY_TIERS } from "@/constants/checkout";
import { formatVnd } from "@/lib/format";
import type { DeliveryTierId } from "@/types/checkout";
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";

interface DeliveryPickerProps {
  value: DeliveryTierId;
  onChange: (id: DeliveryTierId) => void;
}

export function DeliveryPicker({ value, onChange }: DeliveryPickerProps) {
  return (
    <FieldSet>
      <FieldLegend>Delivery tier</FieldLegend>
      <FieldGroup className="gap-3">
        {DELIVERY_TIERS.map((tier) => (
          <FieldLabel key={tier.id} className="cursor-pointer">
            <Field orientation="horizontal" className="items-start">
              <input
                type="radio"
                name="delivery-tier"
                value={tier.id}
                checked={value === tier.id}
                onChange={() => onChange(tier.id)}
                className="mt-1 size-4 accent-primary"
              />
              <div className="flex flex-1 flex-col gap-0.5">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium">{tier.label}</span>
                  <span className="text-sm font-medium">{formatVnd(tier.fee)}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {tier.minDays}–{tier.maxDays} days
                </span>
              </div>
            </Field>
          </FieldLabel>
        ))}
      </FieldGroup>
    </FieldSet>
  );
}
