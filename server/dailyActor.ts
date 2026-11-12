import { google } from "googleapis";

import { getCache, setCache } from "./cache.js";
import { getActor } from "./actorCredits.js";
import { ExternalServiceError } from "./tmdb.js";
import type { Actor } from "./types.js";

const SHEET_RANGE = "DailyActor!A:G";
const COLUMN_DATE = 1;
const COLUMN_ACTOR_ID = 2;
const COLUMN_BACON_NUMBER = 3;
const COLUMN_INDEX = 0;

function createSheetsClient() {
	const spreadsheetId = process.env["BACON_SHEET_ID"];
	const email = process.env["BACON_SERVICE_ACCOUNT_EMAIL"];
	const key = process.env["BACON_PRIVATE_KEY"]?.replace(/\\n/g, "\n");
	if (!spreadsheetId || !email || !key) {
		throw new Error(
			"Google Sheets service-account environment is incomplete.",
		);
	}

	const auth = new google.auth.JWT({
		email,
		key,
		scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
	});
	return { sheets: google.sheets({ version: "v4", auth }), spreadsheetId };
}

export async function getDailyActorFromSheet(
	date: string,
): Promise<Actor | null> {
	const cached = getCache<Actor>(`daily-actor-${date}`);
	if (cached) {
		return cached;
	}

	const { sheets, spreadsheetId } = createSheetsClient();
	let rows: string[][];
	try {
		const response = await sheets.spreadsheets.values.get({
			spreadsheetId,
			range: SHEET_RANGE,
		});
		rows = (response.data.values ?? []) as string[][];
	} catch (error) {
		throw new ExternalServiceError(
			"Google Sheets",
			error instanceof Error ? error.message : "Request failed.",
		);
	}

	const row = rows.find((values) => values[COLUMN_DATE] === date);
	if (!row) {
		return null;
	}

	const actorId = Number(row[COLUMN_ACTOR_ID]);
	if (!Number.isSafeInteger(actorId) || actorId <= 0) {
		throw new Error(
			`Invalid actor ID in the daily-actor sheet for ${date}.`,
		);
	}

	const actor = await getActor(actorId);
	if (!actor) {
		return null;
	}
	actor.bacon_number = Number(row[COLUMN_BACON_NUMBER] || 0);
	actor.game_number = Number(row[COLUMN_INDEX] || 0);
	setCache(`daily-actor-${date}`, actor, 86400);
	return actor;
}

export function getBrisbaneDate(date = new Date()): string {
	const parts = new Intl.DateTimeFormat("en-CA", {
		timeZone: "Australia/Brisbane",
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	}).formatToParts(date);
	const part = (type: "year" | "month" | "day") =>
		parts.find((item) => item.type === type)?.value;
	const year = part("year");
	const month = part("month");
	const day = part("day");
	if (!year || !month || !day) {
		throw new Error("Unable to determine the Brisbane calendar date.");
	}
	return `${year}-${month}-${day}`;
}
