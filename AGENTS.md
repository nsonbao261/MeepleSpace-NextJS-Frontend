<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project

MeepleSpace is boardgame e-commerce in Vietnamese market, features venue discovery and price comparision. Main features: e-commerce with VNPAY, price comparision, venues discovery, wishlist, user reviews, AI Chatbot, availability notification.
This is a frontend-only project. Backend will come later with NestJS Microservice.

## Tech Stack

- **Framework:** Next.js 16.4 (App Router, React 19, TypeScript strict). Turbopack is enabled; `cacheComponents` and `partialPrefetching` are configured in `next.config.ts`.
- **Styling:** Tailwind CSS v4 via `@tailwindcss/turbopack`, `tw-animate-css`, shadcn/ui (Base UI with `base-nova` style, `components.json`), Lucide React, `next-themes`.
- **Data fetching:** TanStack Query v5 with React Query Devtools.
- **Client state:** Zustand; URL state via `nuqs`.
- **Forms and validation:** React Hook Form + Zod with `@hookform/resolvers`.
- **Utilities:** `date-fns`, `class-variance-authority`, `cn` (re-exported from `@/lib/utils`).
- **Testing:** Vitest + Testing Library + jsdom, V8 coverage. `@faker-js/faker` (Vietnamese locale) for fixtures.
- **Quality:** ESLint 9 flat config (`eslint-config-next` core-web-vitals + typescript, `eslint-config-prettier`) and Prettier 3 with `prettier-plugin-tailwindcss`.
- **Fonts:** `Inter` (sans, Latin + Vietnamese) and `Instrument_Serif` (display) via `next/font/google`.
- **E2E:** Playwright is planned but not installed/configured yet.

## Folder Structure

```text
src/
├─ app/                 # Next.js App Router
│  ├─ (public)/         # Public route group (no URL segment)
│  ├─ layout.tsx        # Root layout, fonts, metadata, providers
│  └─ globals.css       # Tailwind v4 entry + design tokens
├─ components/
│  ├─ ui/               # shadcn/ui primitives (Base UI)
│  └─ providers/        # Theme, TanStack Query, nuqs, toaster
├─ config/              # App configuration (scaffolded)
├─ constants/           # Shared constants (scaffolded)
├─ enums/               # Shared enums (scaffolded)
├─ hooks/               # Reusable React hooks (scaffolded)
├─ services/            # API clients / data access (scaffolded)
├─ store/               # Zustand stores (scaffolded)
├─ types/               # Shared TypeScript types (scaffolded)
├─ lib/                 # utils.ts, format.ts (VND/date), faker.ts (VI)
└─ test/                # Vitest setup
public/                 # Static assets
docs/                   # Project specification (SPECIFICATION.md)
specs/                  # Feature specs
```

- Import from `src/` with the `@/*` path alias (e.g., `@/components/ui/button`).
- Keep generated shadcn/ui primitives in `src/components/ui`; app-specific components go under `src/components`.
- Use route groups (e.g., `(auth)`, `(dashboard)`) inside `src/app` to scope layouts.
- Root configs: `next.config.ts`, `tsconfig.json`, `components.json`, `eslint.config.mjs`, `vitest.config.mts`, `.prettierrc.json`, `.prettierignore`.

## Commands

| Command | Purpose |
| --- | --- |
| `npm install` | Install dependencies |
| `npm run dev` | Start the dev server at http://localhost:3000 (Turbopack) |
| `npm run build` | Create a production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npx tsc --noEmit` | Type-check (no npm script yet) |
| `npm run format` | Format all files with Prettier |
| `npm run format:check` | Check formatting |
| `npm run test` | Run Vitest once |
| `npm run test:watch` | Run Vitest in watch mode |
| `npm run test:coverage` | Run tests with V8 coverage |
| `npx shadcn@latest add <component>` | Add a shadcn/ui component |

- Copy `.env.example` to `.env.local` before local development (see `NEXT_PUBLIC_API_URL`).
- Playwright has no script yet because it is not installed/configured.
- Before finishing a task, run `npm run lint`, `npx tsc --noEmit`, and `npm run test`.

## Ruleset

## Doc

- For Project Specification, refer @docs/SPECIFICATION.md
