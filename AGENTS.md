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
├─ data/                # Mock/seed data (products.mock.ts)
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

| Command                             | Purpose                                                   |
| ----------------------------------- | --------------------------------------------------------- |
| `npm install`                       | Install dependencies                                      |
| `npm run dev`                       | Start the dev server at http://localhost:3000 (Turbopack) |
| `npm run build`                     | Create a production build                                 |
| `npm run start`                     | Serve the production build                                |
| `npm run lint`                      | Run ESLint                                                |
| `npm run typecheck`                 | Type-check (`tsc --noEmit`)                               |
| `npm run verify`                    | Gate: typecheck + lint + test                             |
| `npm run format`                    | Format all files with Prettier                            |
| `npm run format:check`              | Check formatting                                          |
| `npm run test`                      | Run Vitest once                                           |
| `npm run test:watch`                | Run Vitest in watch mode                                  |
| `npm run test:coverage`             | Run tests with V8 coverage                                |
| `npx shadcn@latest add <component>` | Add a shadcn/ui component                                 |

- Copy `.env.example` to `.env.local` before local development (see `NEXT_PUBLIC_API_URL`).
- Playwright has no script yet because it is not installed/configured.
- Before finishing a task, run `npm run format`, then `npm run verify`.

## Ruleset

- No unapproved code changes, always stop and ask for confirmation.
- No unapproved shell commands, always ask if i want to run it manually or not. Except for `npm run verify`, `npm run format` and test commands.
- When getting problems, present me solutions and ask for my decision. Do not automatically implement code changes.
- When getting tasks, define the task and only load the relavant docs and skills. Do not load all docs and skills at once.
- For Code Comments, keep it short and precise for interpretation, do not mention docs in Code Comments.
- Barrel imports: every module folder under `src/` must have an `index.ts` (exceptions: `components/ui`, `test`, `app`, and `cn` from `@/lib/utils`). Import through the folder barrel (e.g. `@/store`, `@/components/landing`); `src/app` may use `@/components`. Same-folder sibling imports stay direct, and never import `@/components` from inside `src/components`.
- Images: no top-level files in `public/assets/images` — always place them in a category subfolder (`common/`, `products/`, ...).

## Doc

- For Project Specification, refer @docs/SPECIFICATION.md
- For Detail Implementation Plan, refer @docs/features/<feature-name>.md.

Note: Keep every doc precise and short, only include important information. Try to use plain text only to keep the doc readable.
