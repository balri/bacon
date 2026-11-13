import { google } from "googleapis";

import { getActor } from "./actorCredits.js";
import { getCache, setCache } from "./cache.js";
import type { BaconNumberResult } from "./baconNumber.js";
import { ExternalServiceError } from "./tmdb.js";
import type { Actor } from "./types.js";

const SHEET_RANGE = "DailyActor!A:G";
const INDEX_RANGE = "DailyActorIndex!A1:A2";
const DAILY_LOOKUP_ROW_LIMIT = 2;
const COLUMN_DATE = 1;
const COLUMN_ACTOR_ID = 2;
const COLUMN_BACON_NUMBER = 3;
const COLUMN_INDEX = 0;

function createSheetsClient(writeAccess = false) {
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
		scopes: [
			writeAccess
				? "https://www.googleapis.com/auth/spreadsheets"
				: "https://www.googleapis.com/auth/spreadsheets.readonly",
		],
	});
	return { sheets: google.sheets({ version: "v4", auth }), spreadsheetId };
}

type SheetsClient = ReturnType<typeof createSheetsClient>;

type SheetIndex = {
	lastRow: number;
	maxGameNumber: number;
};

async function getSheetIndex({
	sheets,
	spreadsheetId,
}: SheetsClient): Promise<SheetIndex> {
	let values: string[][];
	try {
		const response = await sheets.spreadsheets.values.get({
			spreadsheetId,
			range: INDEX_RANGE,
		});
		values = (response.data.values ?? []) as string[][];
	} catch (error) {
		throw new ExternalServiceError(
			"Google Sheets",
			error instanceof Error ? error.message : "Request failed.",
		);
	}

	const lastRow = Number(values[0]?.[0]);
	const maxGameNumber = Number(values[1]?.[0]);
	if (
		!Number.isSafeInteger(lastRow) ||
		lastRow < 0 ||
		!Number.isSafeInteger(maxGameNumber) ||
		maxGameNumber < 0
	) {
		throw new Error(
			"DailyActorIndex!A1:A2 must contain valid last-row and max-index formulas.",
		);
	}
	return { lastRow, maxGameNumber };
}

async function getSheetRows(
	{ sheets, spreadsheetId }: SheetsClient,
	startRow: number,
	endRow: number,
): Promise<string[][]> {
	if (endRow < startRow) {
		return [];
	}
	try {
		const response = await sheets.spreadsheets.values.get({
			spreadsheetId,
			range: `DailyActor!A${startRow}:G${endRow}`,
		});
		return (response.data.values ?? []) as string[][];
	} catch (error) {
		throw new ExternalServiceError(
			"Google Sheets",
			error instanceof Error ? error.message : "Request failed.",
		);
	}
}

async function getSheetTail(
	client: SheetsClient,
	rowLimit: number,
): Promise<SheetIndex & { rows: string[][]; startRow: number }> {
	const index = await getSheetIndex(client);
	const startRow = Math.max(1, index.lastRow - rowLimit + 1);
	const rows = await getSheetRows(client, startRow, index.lastRow);
	return { ...index, rows, startRow };
}

export async function getDailyActorFromSheet(
	date: string,
): Promise<Actor | null> {
	const cached = getCache<Actor>(`daily-actor-${date}`);
	if (cached) {
		return cached;
	}

	const { rows } = await getSheetTail(
		createSheetsClient(),
		DAILY_LOOKUP_ROW_LIMIT,
	);

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

export async function isActorInSheet(
	actorId: number,
	daysWindow?: number,
): Promise<boolean> {
	const client = createSheetsClient();
	const { lastRow } = await getSheetIndex(client);
	const rowLimit =
		daysWindow && daysWindow > 0 ? daysWindow : Math.max(1, lastRow);
	let rows = await getSheetRows(
		client,
		Math.max(1, lastRow - rowLimit + 1),
		lastRow,
	);
	if (daysWindow && daysWindow > 0) {
		rows = rows
			.filter((row) => row[COLUMN_DATE])
			.sort((a, b) =>
				(b[COLUMN_DATE] || "").localeCompare(a[COLUMN_DATE] || ""),
			)
			.slice(0, daysWindow);
	}

	return rows.some(
		(row) =>
			row[COLUMN_ACTOR_ID] && Number(row[COLUMN_ACTOR_ID]) === actorId,
	);
}

export async function setDailyActorInSheet(
	date: string,
	actor: Actor,
	baconNumberResult: BaconNumberResult,
): Promise<void> {
	const client = createSheetsClient(true);
	const { rows, startRow, maxGameNumber } = await getSheetTail(
		client,
		DAILY_LOOKUP_ROW_LIMIT,
	);
	let rowToUpdate = -1;

	for (const [index, row] of rows.entries()) {
		if (!row) {
			continue;
		}
		if (row[COLUMN_DATE] === date) {
			rowToUpdate = index;
			break;
		}
	}

	const rowValues = [
		rowToUpdate >= 0
			? (rows[rowToUpdate]?.[COLUMN_INDEX] ?? String(maxGameNumber))
			: String(maxGameNumber + 1),
		date,
		String(actor.id),
		String(baconNumberResult.depth),
		actor.name,
		new Date().toISOString(),
		JSON.stringify(baconNumberResult),
	];

	try {
		if (rowToUpdate >= 0) {
			const rowNumber = startRow + rowToUpdate;
			await client.sheets.spreadsheets.values.update({
				spreadsheetId: client.spreadsheetId,
				range: `DailyActor!A${rowNumber}:G${rowNumber}`,
				valueInputOption: "RAW",
				requestBody: { values: [rowValues] },
			});
		} else {
			await client.sheets.spreadsheets.values.append({
				spreadsheetId: client.spreadsheetId,
				range: SHEET_RANGE,
				valueInputOption: "RAW",
				requestBody: { values: [rowValues] },
			});
		}
	} catch (error) {
		throw new ExternalServiceError(
			"Google Sheets",
			error instanceof Error ? error.message : "Request failed.",
		);
	}
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
