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

The catalog's client controls use **`nuqs`** (`^2.10.1`) for URL state, with a `NuqsAdapter`
wrapping `{children}` in `src/app/layout.tsx`. The catalog page's own `searchParams` read stays the
authority — nuqs is not (see **Catalog** below).

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
│   │                     and holds /catalog — the app's only dynamic (ƒ) route
│   ├── (auth)/           the four auth routes, split brand/form shell; own TooltipProvider
│   └── globals.css       design tokens — never a second CSS file
├── components/
│   ├── ui/               shadcn vendor code (Base UI primitives, base-nova style)
│   ├── auth/             RHF + zod forms, avatar, account view
│   ├── catalog/          /catalog chrome: toolbar, facets, sidebar, sheet, results, pagination
│   ├── layout/           SiteHeader, MobileNav, ScrolledBar, AccountControl, SiteFooter
│   ├── product/          card, rails, badges, cart actions, carousel viewport, wishlist button
│   ├── hero/             landing hero + cover fan
│   └── shared/           ThemeToggle
├── providers/            app-wide client singletons (ThemeProvider) — a sibling of components/
├── stores/auth-store.ts  MOCK auth: zustand + persist on localStorage
├── lib/                  cn, format, slug, auth-schemas (zod), catalog-params (URL contract), queries (read layer)
├── constants/            static lookup tables (game categories, catalog facets)
├── data/                 server-only, faker-seeded MOCK data — deleted when the backend lands
└── types/                entity contracts; mirror the future NestJS DTOs
```

`(admin)` is planned but not created. `src/hooks/` and `src/services/` are empty placeholders.
Client components outside `ui/`: `theme-toggle`, `mobile-nav`, `scrolled-bar`, `account-control`,
`cart-actions`, `carousel-viewport`, `wishlist-button`, the six `catalog/` islands
(`catalog-toolbar`, `catalog-search`, `catalog-sort`, `catalog-facets`, `catalog-sheet`,
`catalog-page-canonicaliser`) and everything under `components/auth/`.

## Catalog

`/catalog` is the app's only dynamic route (`ƒ`) — it reads `searchParams`. **Read the URL contract
in `src/lib/catalog-params.ts` before touching a control**: 13 parameters (`q`, `category`,
`publisher`, `priceMin`, `priceMax`, `rating`, `players`, `time`, `age`, `badge`, `sort`, `dir`,
`page`), defaults omitted, repeated params for the multi-select facets, malformed enum/integer
values dropped and `priceMin`/`priceMax` swapped rather than thrown. The page parses `searchParams`
once and hands the same `CatalogFilters` to both the query layer and the controls, so a control and
the grid cannot disagree.

`src/lib/queries.ts` is `server-only` (it reaches into the faker-seeded `src/data/`), so **nothing
under `src/components/catalog/` may import it** — filters and facet counts reach the controls as
props from the server page. `queryCatalog` is the read layer's catalog entry point; it returns the
filtered items plus the clamped `filters`, `priceBounds`, the publisher/category lists and the facet
counts.

`SectionHeading`'s `viewAllHref` is a typed `Route`, not a hash-only string — the landing rails'
*View all* links point at `/catalog?badge=…`.

## Workflow

Spec-driven, per feature, under `specs/<feature>/`: `specification.md` (overview, requirements,
in/out of scope, decisions, edge cases), then `plan.md` (ordered steps with checkboxes,
dependencies, files touched, done-when). Implement one step at a time and stop for review at each
step boundary.

- Check format and verify after each step, `npm run build` after the last.

**`specs/` and `PROMPT.md` are gitignored** — they are local-only and will not appear in a clean
clone or in `git status`.

## Coding Rules

- No unapproved code changes, always ask before actually modify codebase.
- No unapproved shell commands, except for verify or format.
