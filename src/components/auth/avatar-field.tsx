"use client";

import { useState, useRef, ChangeEvent } from "react";
import { Field, FieldError } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getInitials } from "@/lib/format";
import { Upload, X } from "lucide-react";

const MAX_AVATAR_BYTES = 2 * 1024 * 1024;

interface AvatarFieldProps {
  name?: string;
  value?: string;
  onChange: (url: string | undefined) => void;
  error?: string;
}

export function AvatarField({ name, value, onChange, error }: AvatarFieldProps) {
  const [preview, setPreview] = useState<string | undefined>(value);
  const [fileError, setFileError] = useState<string>();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setFileError("Please choose an image file (JPG or PNG)");
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

  function handleRemove() {
    setPreview(undefined);
    setFileError(undefined);
    onChange(undefined);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  const fallback = name ? getInitials(name) : "??";
  const displayPreview = preview || value;

  return (
    <Field className="gap-2">
      <Label className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        Profile Avatar
      </Label>
      <div className="flex items-center gap-4">
        <Avatar className="size-16 ring-2 ring-border/50">
          {displayPreview ? (
            <AvatarImage src={displayPreview} alt="Avatar preview" className="object-cover" />
          ) : (
            <AvatarFallback className="bg-primary/10 text-base font-medium text-primary">
              {fallback}
            </AvatarFallback>
          )}
        </Avatar>
        <input
          type="file"
          accept="image/png, image/jpeg, image/webp"
          ref={inputRef}
          className="hidden"
          onChange={handleFileChange}
        />
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-9 gap-1.5 rounded-xl font-medium"
              onClick={() => inputRef.current?.click()}
            >
              <Upload className="size-4" />
              {displayPreview ? "Replace image" : "Upload avatar"}
            </Button>
            {displayPreview && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-9 gap-1.5 rounded-xl text-muted-foreground hover:text-destructive"
                onClick={handleRemove}
              >
                <X className="size-4" />
                Remove
              </Button>
            )}
          </div>
          <span className="text-xs text-muted-foreground">JPG or PNG, max 2 MB</span>
        </div>
      </div>
      {(fileError || error) && <FieldError>{fileError || error}</FieldError>}
    </Field>
  );
}
