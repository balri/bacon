import { getRandomActor } from "./actorCredits.js";
import {
	getBrisbaneDate,
	getDailyActorFromSheet,
	isActorInSheet,
	setDailyActorInSheet,
} from "./dailyActor.js";
import { getBaconNumber } from "./baconNumber.js";
import { OperationTimeoutError } from "./tmdb.js";

const TIME_BUDGET_MS = 60_000;
const MAX_ATTEMPTS = 10;

type PrimeDailyActorResult = {
	status: 200 | 404 | 500;
	body: { message: string } | { error: string };
};

export async function primeDailyActor(): Promise<PrimeDailyActorResult> {
	const deadline = Date.now() + TIME_BUDGET_MS;
	const remainingMs = () => deadline - Date.now();
	const requireTime = () => {
		const remaining = remainingMs();
		if (remaining <= 0) {
			throw new OperationTimeoutError(
				"Daily actor search exceeded its execution time budget.",
			);
		}
		return remaining;
	};

	const tomorrow = getBrisbaneDate(
		new Date(Date.now() + 24 * 60 * 60 * 1000),
	);
	if (await getDailyActorFromSheet(tomorrow)) {
		return {
			status: 200,
			body: { message: "Daily actor for tomorrow is already set." },
		};
	}

	for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
		const actor = await getRandomActor(requireTime());
		if (!actor) {
			if (remainingMs() <= 0) {
				requireTime();
			}
			return {
				status: 500,
				body: { error: "Failed to fetch a random actor." },
			};
		}

		if (await isActorInSheet(actor.id, 90)) {
			requireTime();
			continue;
		}

		const baconNumberResult = await getBaconNumber(
			actor.id,
			6,
			requireTime(),
		);
		if (baconNumberResult) {
			await setDailyActorInSheet(tomorrow, actor, baconNumberResult);
			return {
				status: 200,
				body: { message: "Daily actor for tomorrow has been set." },
			};
		}
		requireTime();
	}

	return {
		status: 404,
		body: {
			message:
				"Failed to set daily actor for tomorrow after multiple attempts.",
		},
	};
}
