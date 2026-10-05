"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

const SCROLL_THRESHOLD = 8;

export function ScrolledBar({ className }: { className?: string }) {
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 border-b transition-colors duration-200 motion-reduce:transition-none",
        scrolled ? "border-border" : "border-transparent",
        className,
      )}
    />
  );
}
