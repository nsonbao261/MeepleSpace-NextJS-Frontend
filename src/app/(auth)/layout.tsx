import { AuthShell } from "@/components/auth/auth-shell";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <TooltipProvider>
      <AuthShell>{children}</AuthShell>
    </TooltipProvider>
  );
}
