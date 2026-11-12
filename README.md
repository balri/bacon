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

The Bacon API is implemented as Vercel Functions in `api/bacon/`. Vercel rewrites
the existing `/bacon/api/...` URLs to those functions, so the web client can
keep using its current routes. The initial port includes:

- `GET /bacon/api/daily-actor`
- `GET /bacon/api/movies/:actorId`
- `GET /bacon/api/actors/:movieId`
- `GET /bacon/api/actor/:actorId`

Use the repository root (`.`) as the Vercel project root directory.

Configure these Vercel environment variables:

- `TMDB_API_KEY` (used by all API functions)
- `BACON_SHEET_ID` (daily-actor only)
- `BACON_SERVICE_ACCOUNT_EMAIL` (daily-actor only)
- `BACON_PRIVATE_KEY` (daily-actor only; store the service-account private key;
  escaped `\n`
  newlines are supported)

For local development, `npm run dev` proxies `/bacon/api` to the legacy backend
at `http://localhost:3000`. To run the Vercel Functions locally instead, run
`vercel dev` from the repository root and configure the same environment
variables.

The mobile app's API base URL has not yet been migrated. The state-changing
`prime-daily-actor` endpoint is also intentionally deferred until it has an
authorization and scheduling design. The legacy per-process rate limiter has
not been replaced; configure a shared rate limit before exposing these routes
to production traffic.
