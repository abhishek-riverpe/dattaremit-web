# dattaremit-web — Session Context

## Stack

Next.js (App Router) + React 19 + TypeScript | Tailwind CSS v4 | Clerk auth | Jest tests

## Key Commands

- `npm run dev` — start Next.js dev server
- `npm run build` — production build (next build)
- `npm test` — run Jest tests
- `npm run lint` — ESLint
- `npm run type-check` — tsc --noEmit
- `npm run format` — Prettier

## Workflow Rules

- Run `npm test` and `npm run build` before committing; fix failures first
- Pre-commit hook (husky + lint-staged) auto-fixes staged files on `git commit`
- Push after committing unless told otherwise

## Architecture

Next.js App Router (`app/` directory) | React Query for server state | Zustand store

- Server Components by default; add `"use client"` only when needed
- Services in `services/` call the backend API
- Shared UI components in `components/`
- Clerk handles auth (`@clerk/nextjs`)
