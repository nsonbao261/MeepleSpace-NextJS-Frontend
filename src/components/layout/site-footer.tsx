import Link from "next/link";
import { GlobeIcon, MailIcon, MessageCircleIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const SHOP_LINKS = [
  { label: "New Arrivals", href: "#new-arrivals" },
  { label: "Best Sellers", href: "#best-sellers" },
  { label: "On Sale", href: "#on-sale" },
  { label: "Catalog", href: "#catalog" },
] as const;

const SUPPORT_LINKS = [
  { label: "Shipping", href: "#" },
  { label: "Returns", href: "#" },
  { label: "FAQ", href: "#" },
  { label: "Contact", href: "#" },
] as const;

// lucide-react dropped its brand marks, so these are deliberately generic:
// labelling a Globe icon "Facebook" would be a lie on a shop we are faking anyway.
const SOCIAL_LINKS = [
  { label: "Website", icon: GlobeIcon },
  { label: "Community", icon: MessageCircleIcon },
  { label: "Newsletter", icon: MailIcon },
] as const;

function LinkGroup({
  title,
  links,
}: {
  title: string;
  links: readonly { label: string; href: `#${string}` }[];
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold">{title}</h3>
      <ul className="mt-3 flex flex-col gap-2">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 md:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-heading text-lg font-semibold tracking-tight">
              Meeple Space
            </p>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              Your wonderful space for board games — browse, compare, and bring
              the table to life.
            </p>
          </div>

          <LinkGroup title="Shop" links={SHOP_LINKS} />
          <LinkGroup title="Support" links={SUPPORT_LINKS} />

          <div>
            <h3 className="text-sm font-semibold">Connect</h3>
            <ul className="mt-3 flex items-center gap-2">
              {SOCIAL_LINKS.map(({ label, icon: Icon }) => (
                <li key={label}>
                  {/* buttonVariants rather than <Button render={<Link/>} />:
                      the primitive would merge type="button" onto an anchor. */}
                  <Link
                    href="#"
                    aria-label={label}
                    className={buttonVariants({
                      variant: "ghost",
                      size: "icon",
                    })}
                  >
                    <Icon />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Stacks on mobile, splits once there is room. The credit is plain
            text, not a link: there is no verified URL for it, and this footer
            already refuses to invent contact details. */}
        <div className="flex flex-col gap-1 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Meeple Space. All rights reserved.</p>
          <p>Designed and built by FroFroFro</p>
        </div>
      </div>
    </footer>
  );
}
