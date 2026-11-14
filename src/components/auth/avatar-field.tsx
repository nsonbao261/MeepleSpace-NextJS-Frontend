"use client";

import { useState, useRef, ChangeEvent } from "react";
import { Field, FieldLabel, FieldContent, FieldError } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getInitials } from "@/lib/format";

const MAX_AVATAR_BYTES = 2 * 1024 * 1024;

interface AvatarFieldProps {
  name?: string;
  onChange: (url: string | undefined) => void;
  error?: string;
}

export function AvatarField({ name, onChange, error }: AvatarFieldProps) {
  const [preview, setPreview] = useState<string>();
  const [fileError, setFileError] = useState<string>();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setFileError("Please choose an image file");
      setPreview(undefined);
      onChange(undefined);
      return;
    }

    if (file.size > MAX_AVATAR_BYTES) {
      setFileError("Image must be 2 MB or smaller");
      setPreview(undefined);
      onChange(undefined);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const url = event.target?.result as string;
      setFileError(undefined);
      setPreview(url);
      onChange(url);
    };
    reader.readAsDataURL(file);
  }

  const fallback = name ? getInitials(name) : "??";

  return (
    <Field>
      <FieldLabel>
        <Label>Avatar</Label>
        <FieldContent>
          <div className="flex items-center gap-4">
            <Avatar size="lg">
              {preview ? (
                <AvatarImage src={preview} />
              ) : (
                <AvatarFallback>{fallback}</AvatarFallback>
              )}
            </Avatar>
            <input
              type="file"
              accept="image/*"
              ref={inputRef}
              className="hidden"
              onChange={handleFileChange}
            />
            <Button type="button" variant="outline" onClick={() => inputRef.current?.click()}>
              Upload Image
            </Button>
          </div>
        </FieldContent>
        {(fileError || error) && <FieldError>{fileError || error}</FieldError>}
      </FieldLabel>
    </Field>
  );
}
