# Copilot Instructions for AI Agents

## Project Overview
This repository is a Vite + React + TypeScript app for the Bacon movie/actor experience, with API functionality split between Vercel serverless functions and the legacy local server.

- **Repository root**: React web app (`src/`, `index.html`, Vite config)
- **api/**: Vercel Functions for the Bacon API (`api/`)
- **server/**: Legacy backend/server code kept for compatibility and local proxying
- **analysis/**: Python scripts for ratings/data import workflows

## Architecture & Data Flow
- The web app lives in `src/` and is the primary UI surface.
- API routes under `api/` implement the current Bacon backend behavior and are served by Vercel.
- `server/` remains for legacy support and local dev compatibility.
- Data fetching should follow the established patterns in the web app and the API modules rather than introducing new ad hoc backend code.
- Reusable UI pieces live under `src/utils/` and domain folders such as `src/actors/` and `src/movies/`.

## Developer Workflows
### Web app
- **Install deps:** `npm install`
- **Dev server:** `npm run dev`
- **Build:** `npm run build`
- **Tests:** `npm run test` (Vitest)
- **Lint:** `npm run lint`
- **Format:** `npm run format`

### API / Vercel work
- **Local Vercel dev:** run `vercel dev` from the repository root
- **Project root for Vercel:** use the repository root (`.`)
- **Current API routes:** `/api/daily-actor`, `/api/movies/:actorId`, `/api/actors/:movieId`, `/api/actor/:actorId`
- **Required env vars:** `TMDB_API_KEY`, `BACON_SHEET_ID`, `BACON_SERVICE_ACCOUNT_EMAIL`, `BACON_PRIVATE_KEY`
- **Local compatibility:** `npm run dev` proxies `/api` to the legacy backend at `http://localhost:3000`.

## Project-Specific Patterns
- **Component structure:** domain folders such as `src/actors/`, `src/movies/`, and `src/utils/` own their components and tests.
- **TypeScript:** strict typing is expected throughout the app and API code.
- **Testing:** major components and behaviors should have matching tests under `__tests__` folders.
- **Styling:** frontend styling uses CSS in `src/` and should stay consistent with the existing design system.
- **Integration:** keep API calls centralized and in the existing request patterns instead of scattering fetch logic across components.

## Integration Points
- **Primary frontend:** `src/`
- **API implementation:** `api/`
- **Legacy compatibility layer:** `server/`
- **Analysis utilities:** `analysis/`
- **No new backend work in a deprecated `backend/` directory:** the current API surface is in `api/` and `server/` only.

## Conventions
- **File naming:** PascalCase for React components, camelCase for functions and variables.
- **Tests:** keep tests in `__tests__` subfolders and name them `ComponentName.test.tsx` when component-level coverage is needed.
- **Scope:** prefer changes that fit the current Vite + API architecture without introducing unrelated mobile or backend scaffolding.

## Key Files & Directories
- `src/`: primary web app code
- `src/actors/`, `src/movies/`, `src/utils/`: main UI domains
- `api/`: Vercel Bacon API implementation
- `server/`: legacy backend compatibility
- `analysis/`: data import and rating scripts
- `src/__tests__/`: frontend tests

---
For questions or unclear conventions, ask for clarification or review recent PRs and README updates for examples.
