import Link from "next/link";
import { MailIcon, MapPinIcon, PhoneIcon } from "lucide-react";

import { Logo } from "@/components/layout/logo";
import type { LucideIcon } from "lucide-react";

interface FooterLink {
  label: string;
  href: string;
}

interface ContactItem {
  icon: LucideIcon;
  label: string;
  href?: string;
}

const QUICK_LINKS: FooterLink[] = [
  { label: "Products", href: "/products" },
  { label: "Venues", href: "/venues" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const SOCIAL_LINKS: FooterLink[] = [
  { label: "Facebook", href: "https://facebook.com/meeplespace" },
  { label: "Instagram", href: "https://instagram.com/meeplespace" },
  { label: "YouTube", href: "https://youtube.com/@meeplespace" },
  { label: "TikTok", href: "https://tiktok.com/@meeplespace" },
];

const CONTACT_ITEMS: ContactItem[] = [
  { icon: MailIcon, label: "hello@meeplespace.vn", href: "mailto:hello@meeplespace.vn" },
  { icon: PhoneIcon, label: "1900 1234", href: "tel:19001234" },
  { icon: MapPinIcon, label: "District 1, Ho Chi Minh City" },
];

/** Brand, quick links, contact and social. Static server component. */
export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-muted/40">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-3">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-3 text-sm text-muted-foreground">
            Board games, venues, and price comparison for the Vietnamese market.
          </p>
        </div>

        <nav aria-label="Footer">
          <h2 className="text-sm font-semibold">Quick links</h2>
          <ul className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
            {QUICK_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="hover:text-foreground hover:underline hover:underline-offset-4"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-sm font-semibold">Contact</h2>
          <ul className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
            {CONTACT_ITEMS.map(({ icon: Icon, label, href }) => (
              <li key={label} className="flex items-center gap-2">
                <Icon aria-hidden="true" className="size-4 shrink-0" />
                {href ? (
                  <a
                    href={href}
                    className="underline-offset-4 hover:text-foreground hover:underline"
                  >
                    {label}
                  </a>
                ) : (
                  label
                )}
              </li>
            ))}
          </ul>

          <h2 className="mt-6 text-sm font-semibold">Follow us</h2>
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
            {SOCIAL_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="underline-offset-4 hover:text-foreground hover:underline"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-border py-4">
        <p className="mx-auto max-w-6xl px-4 text-sm text-muted-foreground">
          © 2026 MeepleSpace. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
