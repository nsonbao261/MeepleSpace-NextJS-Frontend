import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function PublicLayout({ children }: LayoutProps<"/">) {
  return (
    <TooltipProvider>
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </TooltipProvider>
  );
}
