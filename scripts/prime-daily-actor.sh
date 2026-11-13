#!/bin/bash
set -euo pipefail

ENDPOINT="${PRIME_DAILY_ACTOR_URL:-https://bacon-topaz.vercel.app/api/prime-daily-actor}"

if [[ -z "${CRON_SECRET:-}" ]]; then
	echo "CRON_SECRET must be set." >&2
	exit 2
fi

if [[ "$ENDPOINT" != https://* && "$ENDPOINT" != http://localhost:* && "$ENDPOINT" != http://127.0.0.1:* ]]; then
	echo "Use HTTPS for remote endpoints; HTTP is allowed only for localhost." >&2
	exit 2
fi

if [[ "$ENDPOINT" != */api/prime-daily-actor ]]; then
	echo "PRIME_DAILY_ACTOR_URL must end with /api/prime-daily-actor." >&2
	exit 2
fi

start=$(date +%s)
umask 077
body=$(mktemp)
headers=""

cleanup() {
	rm -f "$body"
	if [[ -n "$headers" ]]; then
		rm -f "$headers"
	fi
	end=$(date +%s)
	elapsed=$((end - start))
	echo "Script runtime: ${elapsed} seconds"
}
trap cleanup EXIT

headers=$(mktemp)
printf 'Authorization: Bearer %s\n' "$CRON_SECRET" >"$headers"
status=$(curl -Ls -o "$body" -w "%{http_code}" --header "@$headers" "$ENDPOINT")

if [[ "$status" == "200" ]]; then
	echo "Daily actor: $(cat "$body")"
else
	echo "Failed to prime daily actor: HTTP $status" >&2
	cat "$body" >&2
	exit 1
fi
