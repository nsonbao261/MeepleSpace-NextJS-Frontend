"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { newAddressSchema, type NewAddressFormValues } from "@/schemas/checkout";
import type { Address } from "@/types/checkout";
import { Badge } from "@/components/ui/badge";
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
import { Separator } from "@/components/ui/separator";

interface AddressPickerProps {
  addresses: Address[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onAdd: (address: Address) => void;
}

export function AddressPicker({ addresses, selectedId, onSelect, onAdd }: AddressPickerProps) {
  const [showForm, setShowForm] = useState(false);
  const [nextLocalId, setNextLocalId] = useState(1);

  const form = useForm<NewAddressFormValues>({
    resolver: zodResolver(newAddressSchema),
    mode: "onTouched",
    defaultValues: {
      recipientName: "",
      phone: "",
      line1: "",
      ward: "",
      district: "",
      province: "",
      label: "",
    },
  });

  function handleAdd(values: NewAddressFormValues) {
    const address: Address = {
      id: `addr_local_${nextLocalId}`,
      isDefault: false,
      ...values,
    };
    setNextLocalId((id) => id + 1);
    onAdd(address);
    form.reset();
    setShowForm(false);
  }

  return (
    <div className="flex flex-col gap-4">
      <FieldSet>
        <FieldLegend>Delivery address</FieldLegend>
        <FieldGroup className="gap-3">
          {addresses.map((address) => (
            <FieldLabel key={address.id} className="cursor-pointer">
              <Field orientation="horizontal" className="items-start">
                <input
                  type="radio"
                  name="delivery-address"
                  value={address.id}
                  checked={selectedId === address.id}
                  onChange={() => onSelect(address.id)}
                  className="mt-1 size-4 accent-primary"
                />
                <div className="flex flex-1 flex-col gap-0.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium">{address.recipientName}</span>
                    <Badge variant="secondary">{address.label}</Badge>
                    {address.isDefault ? <Badge variant="outline">Default</Badge> : null}
                  </div>
                  <span className="text-sm text-muted-foreground">{address.phone}</span>
                  <span className="text-sm text-muted-foreground">
                    {address.line1}, {address.ward}, {address.district}, {address.province}
                  </span>
                </div>
              </Field>
            </FieldLabel>
          ))}
        </FieldGroup>
      </FieldSet>

      {!showForm ? (
        <div>
          <Button type="button" variant="outline" onClick={() => setShowForm(true)}>
            Add new address
          </Button>
        </div>
      ) : (
        <div className="rounded-xl border p-4">
          <div className="mb-4 flex items-center justify-between gap-2">
            <p className="text-sm font-medium">New address</p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                form.reset();
                setShowForm(false);
              }}
            >
              Cancel
            </Button>
          </div>
          <Separator className="mb-4" />
          <form onSubmit={form.handleSubmit(handleAdd)} className="flex flex-col gap-4">
            <FieldGroup className="gap-4 sm:grid sm:grid-cols-2 sm:gap-4">
              <Field>
                <FieldLabel htmlFor="recipientName">Recipient name</FieldLabel>
                <Input id="recipientName" {...form.register("recipientName")} />
                <FieldError errors={[form.formState.errors.recipientName]} />
              </Field>
              <Field>
                <FieldLabel htmlFor="phone">Phone</FieldLabel>
                <Input id="phone" {...form.register("phone")} />
                <FieldError errors={[form.formState.errors.phone]} />
              </Field>
              <Field className="sm:col-span-2">
                <FieldLabel htmlFor="line1">Street address</FieldLabel>
                <Input id="line1" {...form.register("line1")} />
                <FieldError errors={[form.formState.errors.line1]} />
              </Field>
              <Field>
                <FieldLabel htmlFor="ward">Ward/Commune</FieldLabel>
                <Input id="ward" {...form.register("ward")} />
                <FieldError errors={[form.formState.errors.ward]} />
              </Field>
              <Field>
                <FieldLabel htmlFor="district">District</FieldLabel>
                <Input id="district" {...form.register("district")} />
                <FieldError errors={[form.formState.errors.district]} />
              </Field>
              <Field>
                <FieldLabel htmlFor="province">Province/City</FieldLabel>
                <Input id="province" {...form.register("province")} />
                <FieldError errors={[form.formState.errors.province]} />
              </Field>
              <Field>
                <FieldLabel htmlFor="label">Label (optional)</FieldLabel>
                <Input id="label" placeholder="Home" {...form.register("label")} />
                <FieldError errors={[form.formState.errors.label]} />
              </Field>
            </FieldGroup>
            <div className="flex justify-end">
              <Button type="submit" disabled={form.formState.isSubmitting}>
                Use this address
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
