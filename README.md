Run tests:

```
npm run test
```

Format:

```
npm run format
```

Lint:

```
npm run lint
```

To fix:

```
npm run lint:fix
```

Run in dev mode:

```
npm run dev
```

## Bacon API

The Bacon API is implemented as Vercel Functions in `api/`. The public routes are
served from `/api`. The initial port includes:

- `GET /api/daily-actor`
- `GET /api/movies/:actorId`
- `GET /api/actors/:movieId`
- `GET /api/actor/:actorId`

Use the repository root (`.`) as the Vercel project root directory.

Configure these Vercel environment variables:

- `TMDB_API_KEY` (used by all API functions)
- `BACON_SHEET_ID` (daily-actor only)
- `BACON_SERVICE_ACCOUNT_EMAIL` (daily-actor only)
- `BACON_PRIVATE_KEY` (daily-actor only; store the service-account private key;
  escaped `\n`
  newlines are supported)

For local development, `npm run dev` proxies `/api` to the legacy backend at
`http://localhost:3000`. To run the Vercel Functions locally instead, run
`vercel dev` from the repository root and configure the same environment
variables.

The mobile app's API base URL has not yet been migrated. The state-changing
`prime-daily-actor` endpoint is also intentionally deferred until it has an
authorization and scheduling design. The legacy per-process rate limiter has
not been replaced; configure a shared rate limit before exposing these routes
to production traffic.
