"use client";

import * as React from "react";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

// A no-op subscription gives `useSyncExternalStore` a mount signal: the server
// snapshot is false, the client snapshot is true, and React resolves the
// difference across hydration. This replaces the usual setMounted-in-effect,
// which the react-hooks lint rules reject.
const subscribeToNothing = () => () => {};

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = React.useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false,
  );

  const isDark = resolvedTheme === "dark";

  // The server cannot know the resolved theme, so painting the real icon before
  // mount would hand React two different trees. A same-sized inert box avoids
  // both the mismatch and the layout shift.
  if (!mounted) {
    return <div className="size-8 shrink-0" />;
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <MoonIcon /> : <SunIcon />}
    </Button>
  );
}
