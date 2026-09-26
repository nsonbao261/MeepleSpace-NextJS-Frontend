<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project Overview

Meeple Space is boardgame online shop. Users can browse and buy boardgame. This site supports delivery and online payment . Users can also create their own collection and wish lists. Support ai chatbot with ChatGPT

User can also view boardgame price from other shops bgg, shoppee. Users can also look for where they can play Boardgame in Vietnam by crawled data.

Admin Dashboard: user-management, boardgame-management, sales report,...

This is frontend - only projects, apis will come with NestJS lated. Use mock data for developement

## Important Rule

- No unapproved shell commands, except for verification.
- No unapproved code changes, always stop to show diff.
- Follow design tokens.

## Folder Structure

```
public/
└── images/                 # static assets served from /images/*
src/
├── app/
│   ├── (public)/           # storefront routes
│   ├── (admin)/            # admin dashboard routes
│   ├── api/                # route handlers
│   ├── globals.css         # design tokens live here — never create a second CSS file
│   └── layout.tsx          # root layout; ThemeProvider wraps everything
├── components/
│   └── ui/                 # shadcn/ui — vendor code, Prettier-ignored, edit via CLI not by hand
├── providers/              # client-side context providers (ThemeProvider, later QueryProvider)
├── lib/
│   ├── utils.ts            # cn() — re-exports the `cn` package
│   ├── format.ts           # formatPrice / formatNumber / formatDate — all Intl, no date lib
│   └── slug.ts             # slugify()
├── data/                   # server-only + faker-seeded. NEVER import from a client component
└── types/                  # entity contracts; these mirror the future NestJS DTOs
```

`src/providers/` is a sibling of `src/components/`, not a child — providers are app-wide singletons, not composable UI. Feature components belong under `src/components/`.

Route groups `(public)` and `(admin)` are planned, not yet created.

## Tech Stack

| Layer         | Choice                                                                               |
| ------------- | ------------------------------------------------------------------------------------ |
| Framework     | Next.js 16.3.6 (App Router, Turbopack), React 19.2.8                                 |
| Language      | TypeScript 5, `strict: true`, `@/*` -> `src/*`                                       |
| Styling       | Tailwind v4 (`@tailwindcss/postcss`, CSS-first config, no tailwind.config)           |
| Components    | shadcn/ui on **Base UI** primitives, `base-nova` style, `lucide-react` icons         |
| Theming       | `next-themes`, `attribute="class"`, pairs with the `.dark` custom variant            |
| Forms         | `react-hook-form` + `zod` via `@hookform/resolvers` (installed, not yet wired)       |
| Server data   | RSC-first. TanStack Query reserved for client-interactive data only                  |
| Mock data     | `@faker-js/faker` (dev dep), fixed seed, `server-only` guarded, lives in `src/data/` |
| Charts        | Recharts via the shadcn `chart` wrapper                                              |
| Lint / format | ESLint 9 flat config + `eslint-config-next`; Prettier 3 + tailwind plugin            |
| Tests         | None yet. `npm run verify` + `npm run build` is the gate                             |

### Decisions that look odd but are deliberate

- **`cn` replaces `clsx` + `tailwind-merge`.** It is shadcn-ui's own compiled merge engine. Do not reintroduce the old pair.
- **No i18n library.** UI strings are hardcoded Vietnamese; product content stays English. `<html lang="vi">`.
- **Single currency, VND only.** `formatPrice()` takes a plain number. There is no multi-currency support yet.
- **No auth, no zustand, no data layer yet.** `@tanstack/react-query`, `zustand`, `react-hook-form` and `zod` are installed on purpose. Do not delete them as "unused".
- **`cacheComponents` is off.** Do not enable it casually: it errors on uncached data outside `<Suspense>` and removes `revalidate`/`fetchCache`.
- **`middleware.ts` is now `proxy.ts`** (`src/proxy.ts`, Node.js runtime) if route guards are ever needed.

### Known gaps

- No `nameVi` on `Game` — Vietnamese product titles were cut.
- No prose styling. When product descriptions or the chatbot need it, use **Typeset** (one CSS file from ui.shadcn.com/typeset), not `@tailwindcss/typography`. There is no `typography` component; that sidebar link redirects to Typeset.
- No AI SDK, no `msw`, no tests, no `nuqs`, no multi-currency.

## Commands

```bash
npm run dev           # dev server
npm run build         # production build
npm run lint          # ESLint
npm run typegen       # regenerate route types
npm run typecheck     # next typegen && tsc --noEmit
npm run format        # Prettier --write
npm run format:check  # Prettier --check
npm run verify        # lint + typecheck + format:check
```

Regenerate route types after adding or renaming any route — `typedRoutes: true` means `Link href` and `router.push` are type-checked against the route tree.

Add shadcn components with `npx shadcn@latest add <name>`. Add them on demand, not up front: they are source code that lands in `src/components/ui/`.

## Workflow

Spec - driven workflow. For each feature, follow their step:

- Step 1: Create specification.md document: Feature Overview, Functional Requirement, In vs Out scope, Decision, Edge cases,..
- Step 2: Create plan.md: Detailed implementation break down with checkboxs, dependencies required with explanation, critical file touch/ new components/ new routes with explanation.
- Step 3: Guide user to implement steps, stop at each step to update status and code review. Verify after completion.
- Step 4: If getting errros, present users with solution and ask for permission.
