# Copilot Instructions for AI Agents

## Project Overview
This monorepo contains three main components:
- **frontend/**: React + TypeScript web app (Vite)
- **mobile/**: Expo React Native app
- **backend/**: (deprecated, see README)
- **analysis/**: Python scripts for ratings and data import

## Architecture & Data Flow
- **frontend/src/** and **mobile/app/components/** mirror each other for UI components (e.g., ActorCard, MovieCard, Breadcrumbs).
- API calls are centralized in `frontend/src/api.ts` and `mobile/lib/api.ts`.
- Data flows from API modules to list/detail components (e.g., `MovieList`, `MovieView`).
- Utility components (e.g., Loading, SuccessMessage) are reused for consistent UX.

## Developer Workflows
### Frontend
- **Dev server:** `npm run dev`
- **Tests:** `npm run test` (Vitest)
- **Lint:** `npm run lint`
- **Format:** `npm run format`

### Mobile
- **Start Metro Bundler:** `npx expo start`
- **Run on iOS:** `npx expo start --ios`
- **Run on Android:** `npx expo start --android`
- **Lint:** `npx eslint . --fix`
- **Format:** `npx prettier --write .`

## Project-Specific Patterns
- **Component Structure:** Each domain (actors, movies, utils) has a folder with components and matching `__tests__` for unit tests.
- **TypeScript:** Strict typing enforced in both frontend and mobile.
- **Testing:** All major components have corresponding test files in `__tests__` folders.
- **Styling:** Frontend uses global CSS (`index.css`); mobile uses `lib/styles.ts`.
- **Breadcrumbs & Messages:** Use provided utility components for navigation and feedback.

## Integration Points
- **API:** All data fetching should use the provided API modules.
- **Assets:** Images for mobile are in `mobile/assets/images/`.
- **No backend development:** See backend/README.md for deprecation notice.

## Conventions
- **File Naming:** PascalCase for components, camelCase for functions/variables.
- **Tests:** Place in `__tests__` subfolders, name as `ComponentName.test.tsx`.
- **Cross-platform UI:** Keep frontend and mobile components in sync when possible.

## Key Files & Directories
- `frontend/src/api.ts`, `mobile/lib/api.ts`: API logic
- `frontend/src/actors/`, `frontend/src/movies/`, `frontend/src/utils/`: Main component domains
- `mobile/app/components/`: Mobile UI components
- `frontend/src/__tests__/`, `mobile/app/components/__tests__/`: Tests

---
For questions or unclear conventions, ask for clarification or review recent PRs for examples.
