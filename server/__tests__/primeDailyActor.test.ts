import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import * as actorCredits from "../actorCredits.js";
import * as dailyActor from "../dailyActor.js";
import * as baconNumber from "../baconNumber.js";
import { primeDailyActor } from "../primeDailyActor.js";
import { OperationTimeoutError } from "../tmdb.js";
import type { Actor } from "../types.js";

const actor: Actor = {
	id: 123,
	name: "Test Actor",
};

describe("primeDailyActor", () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date("2026-11-13T14:05:00.000Z"));
		vi.spyOn(dailyActor, "getDailyActorFromSheet");
		vi.spyOn(dailyActor, "isActorInSheet");
		vi.spyOn(dailyActor, "setDailyActorInSheet");
		vi.spyOn(actorCredits, "getRandomActor");
		vi.spyOn(baconNumber, "getBaconNumber");
	});

	afterEach(() => {
		vi.restoreAllMocks();
		vi.useRealTimers();
	});

	it("does not choose or write an actor if tomorrow is already set", async () => {
		vi.mocked(dailyActor.getDailyActorFromSheet).mockResolvedValue(actor);

		const result = await primeDailyActor();

		expect(result.status).toBe(200);
		expect(dailyActor.getDailyActorFromSheet).toHaveBeenCalledWith(
			"2026-11-15",
		);
		expect(actorCredits.getRandomActor).not.toHaveBeenCalled();
		expect(dailyActor.setDailyActorInSheet).not.toHaveBeenCalled();
	});

	it("writes the selected actor and Bacon number for tomorrow", async () => {
		const baconResult = {
			depth: 2,
			path: [{ actorId: 4724, actorName: "Kevin Bacon" }],
		};
		vi.mocked(dailyActor.getDailyActorFromSheet).mockResolvedValue(null);
		vi.mocked(actorCredits.getRandomActor).mockResolvedValue(actor);
		vi.mocked(dailyActor.isActorInSheet).mockResolvedValue(false);
		vi.mocked(baconNumber.getBaconNumber).mockResolvedValue(baconResult);
		vi.mocked(dailyActor.setDailyActorInSheet).mockResolvedValue();

		const result = await primeDailyActor();

		expect(result.status).toBe(200);
		expect(dailyActor.isActorInSheet).toHaveBeenCalledWith(123, 90);
		expect(baconNumber.getBaconNumber).toHaveBeenCalledWith(
			123,
			6,
			expect.any(Number),
		);
		expect(dailyActor.setDailyActorInSheet).toHaveBeenCalledWith(
			"2026-11-15",
			actor,
			baconResult,
		);
	});

	it("stops when the search exceeds its serverless execution budget", async () => {
		vi.mocked(dailyActor.getDailyActorFromSheet).mockResolvedValue(null);
		vi.mocked(actorCredits.getRandomActor).mockImplementation(async () => {
			vi.advanceTimersByTime(120_000);
			return null;
		});

		await expect(primeDailyActor()).rejects.toBeInstanceOf(
			OperationTimeoutError,
		);
		expect(dailyActor.setDailyActorInSheet).not.toHaveBeenCalled();
	});
});
