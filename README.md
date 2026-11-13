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
- `GET /api/prime-daily-actor` (Vercel Cron only; requires `CRON_SECRET`)

Use the repository root (`.`) as the Vercel project root directory.

Configure these Vercel environment variables:

- `TMDB_API_KEY` (used by all API functions)
- `BACON_SHEET_ID` (daily-actor reads and scheduled priming)
- `BACON_SERVICE_ACCOUNT_EMAIL` (Google Sheets access)
- `BACON_PRIVATE_KEY` (store the service-account private key;
  escaped `\n`
  newlines are supported)
- `CRON_SECRET` (required to authorize the scheduled daily-actor write)

The service account must have Editor access to the daily-actor spreadsheet.
Read-only API routes use the read-only Sheets scope; the scheduled priming
function uses the Sheets write scope.

Create a `DailyActorIndex` tab in the spreadsheet and add these formulas:

- `A1`: `=IFERROR(MAX(FILTER(ROW(DailyActor!B:B),DailyActor!B:B<>"")),0)`
- `A2`: `=IFERROR(MAX(ARRAYFORMULA(IFERROR(VALUE(DailyActor!A:A),0))),0)`

These track the last populated row and maximum game number. The API reads those
two cells, the latest two rows for daily-actor lookups/writes, and the latest
90 rows for recent-actor checks instead of downloading the full sheet.

For local development, `npm run dev` proxies `/api` to the legacy backend at
`http://localhost:3000`. To run the Vercel Functions locally instead, run
`vercel dev` from the repository root and configure the same environment
variables.

Vercel Cron runs `/api/prime-daily-actor` daily at 14:05 UTC (00:05 in
Brisbane). It chooses an actor for the next Brisbane calendar date. Vercel
sends `Authorization: Bearer <CRON_SECRET>` to scheduled invocations; keep that
secret configured in the Production environment. To invoke it manually, set `CRON_SECRET` to the same value configured in
Vercel, then run:

```sh
./scripts/prime-daily-actor.sh
```

The script defaults to `https://bacon-topaz.vercel.app/api/prime-daily-actor`.
Override it by setting `PRIME_DAILY_ACTOR_URL` (for example, to test against
`vercel dev`). The script requires HTTPS for remote hosts and does not print
the bearer token.

The mobile app's API base URL has not yet been migrated. The legacy per-process
rate limiter has not been replaced; configure a shared rate limit before
exposing these routes to production traffic.
