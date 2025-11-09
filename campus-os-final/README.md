# CampusOS (Frontend-only)

A polished demo student app built with Next.js 14 (App Router) + TypeScript, TailwindCSS, shadcn-style UI, Lucide icons, Framer Motion, React Query, and Zustand. No backend—local mock APIs only.

## How to Run

- Install dependencies: `npm i`
- Start dev server: `npm run dev`
- Open `http://localhost:3000`

## Pages Overview

- `Chat Assistant` (`/chat`)
  - Message list (bubble style) with timestamps
  - Input box with Send; Enter to send, Shift+Enter for newline
  - Helper: “This is a demo. No backend connected yet.”
  - Uses `POST /api/mock/chat` to echo helpful replies after 600ms

- `Recent Activities` (`/activities`)
  - Activity feed (cards: title, time, type)
  - Primary CTA: `Auto-Plan My Week` opens a modal preview
  - Modal fetches `GET /api/mock/planPreview` and lists sessions; `Close` button
  - Empty state and failure state included

- `Weekly Report` (`/report`)
  - Three KPI cards (mock numbers)
  - Simple stacked bar for `Time by Course` (Tailwind divs)
  - Highlights list (2–3 items)
  - Data from `GET /api/mock/report`

## Tech & State

- Next.js 14 (App Router) + TypeScript
- TailwindCSS + shadcn-style UI + Lucide icons
- Framer Motion transitions for page fade-in, modal scale/fade, list mounts
- React Query for local API mocks; Zustand for UI state (modal)
- ESLint + Prettier + Husky pre-commit (runs `lint` and `format:check`)

## Scripts

- `npm run dev` — start dev server
- `npm run build` — build
- `npm run start` — start production
- `npm run lint` — run ESLint
- `npm run format` — Prettier write
- `npm run format:check` — Prettier check

## What’s Next

- Wire real data and authentication
- Calendar write actions and integrations
- Charts library if needed (for richer visuals)

## Acceptance Criteria

- Dev server starts without errors
- Chat: user messages append, mock reply appears
- Activities: mocked feed loads; `Auto-Plan My Week` opens modal and lists sessions
- Weekly Report: three KPIs, stacked bar, and highlights show
- Navigation: top tabs switch pages cleanly
- Polish: subtle animations, focus states, empty/failure states present
