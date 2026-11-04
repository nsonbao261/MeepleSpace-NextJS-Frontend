"use client";

import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

import { cn } from "cn";

import { Input } from "@/components/ui/input";

interface NavSearchProps {
  className?: string;
}

/** Trims the query and routes to the catalog; empty input drops `?q=`. */
export function NavSearch({ className }: NavSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const q = query.trim();
    router.push(q ? `/products?q=${encodeURIComponent(q)}` : "/products");
  }

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className={cn("relative w-full max-w-xs", className)}
    >
      <SearchIcon
        aria-hidden="true"
        className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <Input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search board games…"
        aria-label="Search products"
        className="h-11 rounded-full pr-3 pl-9"
      />
    </form>
  );
}
