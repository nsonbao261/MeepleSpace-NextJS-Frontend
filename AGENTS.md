<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project Overview

Meeple Space is a board game online shop. Users browse and buy board games, with delivery and
online payment, and can build collections and wish lists. The site also surfaces prices from other
shops (BGG, Shopee) and lets people find places to play in Vietnam, plus an AI chatbot. An admin
dashboard will cover user management, game management and sales reports.

**This repo is the frontend only.** The API is NestJS and does not exist yet, so every read is
mock. Built so far: the landing page and a mock auth flow.

## Commands

```bash
npm run dev           # dev server
npm run build         # production build
npm run lint          # ESLint — no --max-warnings, so warnings do not fail the gate
npm run typegen       # regenerate route types
npm run typecheck     # next typegen && tsc --noEmit
npm run format        # Prettier --write
npm run format:check  # Prettier --check
npm run verify        # lint + typecheck + format:check — the gate
```

There are **no tests**. `npm run verify` + `npm run build` is the gate. Add shadcn components on
demand with `npx shadcn@latest add <name>`; they land as source in `src/components/ui/`.

## Framework and toolchain facts

- **Read `node_modules/next/dist/docs/` before writing Next code.** Shipped with 16.3.6 and the
  only authority on this version's behaviour.
- **Route types are generated, and the output is gitignored.** `next.config.ts` sets
  `typedRoutes: true`; `next-env.d.ts` and `.next/types/**` are not committed. Run
  `npm run typegen` after adding or renaming any route, or `Link href` / `router.push` will not
  typecheck. The generated globals are used in-tree: `LayoutProps<"/">`,
  `PageProps<"/product/[slug]">`. **`params` is a Promise in Next 16 — `await params`.**
- **`cacheComponents` is off.** Do not enable it casually: it errors on uncached data outside
  `<Suspense>` and removes `revalidate` / `fetchCache`.
- **There is no `middleware.ts` and no `proxy.ts`.** If route guards are ever needed, the file to
  create is `proxy.ts` (`docs/…/03-file-conventions/proxy.md`). Nothing guards today.
- **Tailwind v4, CSS-first.** No `tailwind.config`; `src/app/globals.css` is the only stylesheet.
  `.prettierrc` points `tailwindStylesheet` at it, so `prettier-plugin-tailwindcss` sorts class
  order — run `npm run format` after writing markup.
- **Theming is `next-themes` with `attribute="class"`**, paired with
  `@custom-variant dark (&:is(.dark *))`. `<Toaster />` must stay **inside** `<ThemeProvider>`;
  outside it, sonner falls back to `prefers-color-scheme`.
- **RSC-first: server component is the default.** Add `"use client"` only for state, event
  handlers, or browser APIs. `src/data/` and `src/lib/queries.ts` are `server-only`, so a client
  component importing them fails the build.

## Design tokens

`globals.css` is the whole system. `--brand-*` is the aubergine ramp, `--paper-*` / `--ink-*` the
neutrals, `--flare` the single promotion accent, `--star-500` the rating colour, and
`--elevation-tint` tints every `shadow-*`. Components consume the semantic shadcn tokens
(`--primary`, `--sale-price`, `--rating`, `--stock-*`, `--focus`).

- **No raw colour values** — no `bg-[#…]`, no arbitrary `oklch()`, no manual `dark:` overrides.
- `--brand-*` and `--paper-*` are declared in `:root`, **not** `@theme`, so there is no
  `bg-brand-500` utility. Reach brand colour through `--primary`, which already maps to the ramp
  per theme.
- `h1`–`h6` and `.font-heading` are Fraunces via the base layer — no font utility needed.
- `formatPrice` is `vi-VN`, `formatDate` / `formatDateTime` are `en-GB`. Deliberate. VND is the
  only currency and `formatPrice()` takes a plain number.

## Architecture

```
src/
├── app/
│   ├── (public)/         storefront routes with SiteHeader + SiteFooter; mounts a TooltipProvider
│   ├── (auth)/           the four auth routes, split brand/form shell; own TooltipProvider
│   └── globals.css       design tokens — never a second CSS file
├── components/
│   ├── ui/               shadcn vendor code (Base UI primitives, base-nova style)
│   ├── auth/             RHF + zod forms, avatar, account view
│   ├── layout/           SiteHeader, MobileNav, ScrolledBar, AccountControl, SiteFooter
│   ├── product/          card, rails, badges, cart actions, carousel viewport
│   ├── hero/             landing hero + cover fan
│   └── shared/           ThemeToggle
├── providers/            app-wide client singletons (ThemeProvider) — a sibling of components/
├── stores/auth-store.ts  MOCK auth: zustand + persist on localStorage
├── lib/                  cn, format, slug, auth-schemas (zod), queries (read layer)
├── constants/            static lookup tables (game categories)
├── data/                 server-only, faker-seeded MOCK data — deleted when the backend lands
└── types/                entity contracts; mirror the future NestJS DTOs
```

`(admin)` is planned but not created. `src/hooks/` and `src/services/` are empty placeholders.
Client components outside `ui/`: `theme-toggle`, `mobile-nav`, `scrolled-bar`, `account-control`,
`cart-actions`, `carousel-viewport`, and everything under `components/auth/`.

## Conventions that differ from the defaults

- **Base UI, not Radix.** Compose with the `render` prop — `<TooltipTrigger render={<Button />} />`.
  `asChild` does not exist in this tree.
- **Never `Button render={<Link />}`.** It injects `type="button"` onto the anchor. Use
  `className={buttonVariants({ … })}` on a `next/link` instead.
- **`cn` is the `cn` package** (shadcn's own merge engine), re-exported from `src/lib/utils.ts`.
  Do not reintroduce `clsx` + `tailwind-merge`.
- **Forms** are `react-hook-form` + `zod` on base-nova `Field` primitives; there is no shadcn
  `Form` wrapper. `FieldShell` and `PasswordFields` read `useFormContext`, so a `FormProvider` is
  mandatory — without one they throw on the first field. `FieldShell` is generic over
  `TFieldValues`; `PasswordFields` deliberately is not, because `useFormContext<T>()` is an
  unchecked cast and the parameter would advertise a check that never runs.
- **zod 4.6.5**: `z.email().trim()` does **not** trim — use
  `z.string().trim().toLowerCase().pipe(z.email())`. Use `error:`, not the deprecated `message:`.
  Compose the email-uniqueness refinement inside each form's `resolver`, never at module scope, or
  it captures `users` at import time and never sees a second registration.
- **`mockGames()` returns the same array reference on every call.** In `lib/queries.ts` use
  `filter` + `toSorted`; an in-place `sort` silently reorders the shared dataset for every other
  reader. `MOCK_SEED` in `data/seed.ts` is fixed — do not re-seed, and note that changing
  `CATALOG`'s length shifts every faker draw anyway.
- **`lib/queries.ts` is the read layer** — the one file expected to change from `mockGames()` to
  HTTP. `src/data/` is deleted at that point.
- **UI strings are hardcoded English**; `<html lang="en">`. Product content is real English titles
  and publisher names, never translated. There is no i18n library.
- **Auth is a client-only mock.** `stores/auth-store.ts` is `zustand` + `persist` on
  `localStorage`: no session cookie, no server-readable session, therefore **no route guard**.
  `/account` self-guards on the client via `router.replace("/login")`. Seeded logins are
  `owner@meeplespace.dev` and `hello@meeplespace.dev`, both with password `demo1234`. Passwords are
  a 32-bit FNV-1a digest — not a hash, brute-forceable in microseconds, protecting nothing. Never
  let a comment imply otherwise. The seed users are re-added in `persist`'s `merge` hook, not the
  initial state, because a stored `users` array would otherwise replace them.
- **Both route groups mount their own `TooltipProvider`.** Without one, a Base UI tooltip does not
  throw — it silently opens after 600ms and loses group handoff, and this repo's `delay = 0`
  default is discarded.
- **`src/components/ui/` is vendor code.** ESLint (`globalIgnores`) and Prettier both skip it, so
  findings there are not actionable. Edit it via the CLI only. Unused vendored files (`sheet`,
  `table`, `textarea`, `card`) are retained on purpose — do not delete them. `sonner.tsx` is
  intentionally the `new-york-v4` item rather than `base-nova`: the `base-nova` one imports a
  path inside shadcn.com's own app and does not compile here.
- **`@tanstack/react-query` is installed and unused, on purpose.** Do not delete it as dead, and do
  not add a `QueryClientProvider` without asking — the auth store is client state, not server
  state.
- `@next/next/no-img-element` is a warning here and lint has no `--max-warnings`, so a plain
  `<img>` disable is legitimate (SVG sources cannot go through `next/image` without
  `images.dangerouslyAllowSVG`).

## Workflow

Spec-driven, per feature, under `specs/<feature>/`: `specification.md` (overview, requirements,
in/out of scope, decisions, edge cases), then `plan.md` (ordered steps with checkboxes,
dependencies, files touched, done-when). Implement one step at a time and stop for review at each
step boundary. `npm run verify` after each step, `npm run build` after the last.

**`specs/` and `PROMPT.md` are gitignored** — they are local-only and will not appear in a clean
clone or in `git status`.

## Other instruction sources

- `CLAUDE.md` is just `@AGENTS.md`.
- `.agents/skills/` holds pinned agent skills (`skills-lock.json`): `shadcn`, `frontend-design`,
  `grill-me`, `migrate-radix-to-base`. Load `shadcn` before touching `components/ui/`.

## Known gaps

No tests, no admin routes, no cart or checkout, no prose styling (use Typeset, not
`@tailwindcss/typography`), no AI SDK, no `msw`, no `nuqs`, no multi-currency, no `nameVi` on
`Game`.
