import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
	actor: vi.fn(),
	append: vi.fn(),
	get: vi.fn(),
	jwt: vi.fn(),
	sheets: vi.fn(),
	update: vi.fn(),
}));

vi.mock("googleapis", () => ({
	google: {
		auth: { JWT: mocks.jwt },
		sheets: mocks.sheets,
	},
}));

vi.mock("../actorCredits.js", () => ({
	getActor: mocks.actor,
}));

vi.mock("../cache.js", () => ({
	getCache: vi.fn(() => null),
	setCache: vi.fn(),
}));

import {
	getDailyActorFromSheet,
	isActorInSheet,
	setDailyActorInSheet,
} from "../dailyActor.js";
import type { Actor } from "../types.js";

const actor: Actor = {
	id: 123,
	name: "Test Actor",
};

const baconNumber = {
	depth: 2,
	path: [{ actorId: 4724, actorName: "Kevin Bacon" }],
};

describe("setDailyActorInSheet", () => {
	beforeEach(() => {
		vi.resetAllMocks();
		process.env["BACON_SHEET_ID"] = "test-sheet";
		process.env["BACON_SERVICE_ACCOUNT_EMAIL"] = "test@example.com";
		process.env["BACON_PRIVATE_KEY"] = "test-key";
		mocks.sheets.mockReturnValue({
			spreadsheets: {
				values: {
					get: mocks.get,
					update: mocks.update,
					append: mocks.append,
				},
			},
		});
	});

	it("looks up the daily actor using only the latest two rows", async () => {
		mocks.get
			.mockResolvedValueOnce({
				data: { values: [["300"], ["299"]] },
			})
			.mockResolvedValueOnce({
				data: {
					values: [
						["298", "2026-11-13", "456", "1"],
						["299", "2026-11-14", "123", "2"],
					],
				},
			});
		mocks.actor.mockResolvedValue({ ...actor });

		const result = await getDailyActorFromSheet("2026-11-14");

		expect(result).toMatchObject({
			id: 123,
			bacon_number: 2,
			game_number: 299,
		});
		expect(mocks.get).toHaveBeenNthCalledWith(
			1,
			expect.objectContaining({ range: "DailyActorIndex!A1:A2" }),
		);
		expect(mocks.get).toHaveBeenNthCalledWith(
			2,
			expect.objectContaining({ range: "DailyActor!A299:G300" }),
		);
	});

	it("checks recent actors using only the requested tail rows", async () => {
		mocks.get
			.mockResolvedValueOnce({
				data: { values: [["300"], ["299"]] },
			})
			.mockResolvedValueOnce({
				data: { values: [["210", "2026-11-14", "123"]] },
			});

		await expect(isActorInSheet(123, 90)).resolves.toBe(true);

		expect(mocks.get).toHaveBeenNthCalledWith(
			2,
			expect.objectContaining({ range: "DailyActor!A211:G300" }),
		);
	});

	it("appends a row with the next game number when the date is new", async () => {
		mocks.get
			.mockResolvedValueOnce({
				data: { values: [["2"], ["8"]] },
			})
			.mockResolvedValueOnce({
				data: {
					values: [
						["Index", "Date", "Actor ID"],
						["8", "2026-11-13", "456"],
					],
				},
			});

		await setDailyActorInSheet("2026-11-14", actor, baconNumber);

		expect(mocks.append).toHaveBeenCalledWith(
			expect.objectContaining({
				range: "DailyActor!A:G",
				valueInputOption: "RAW",
				requestBody: {
					values: [
						expect.arrayContaining([
							"9",
							"2026-11-14",
							"123",
							"2",
							"Test Actor",
							expect.any(String),
							JSON.stringify(baconNumber),
						]),
					],
				},
			}),
		);
		expect(mocks.update).not.toHaveBeenCalled();
	});

	it("updates the existing date row without changing its game number", async () => {
		mocks.get
			.mockResolvedValueOnce({
				data: { values: [["2"], ["4"]] },
			})
			.mockResolvedValueOnce({
				data: {
					values: [
						["Index", "Date", "Actor ID"],
						["4", "2026-11-14", "456"],
					],
				},
			});

		await setDailyActorInSheet("2026-11-14", actor, baconNumber);

		expect(mocks.update).toHaveBeenCalledWith(
			expect.objectContaining({
				range: "DailyActor!A2:G2",
				requestBody: {
					values: [
						expect.arrayContaining(["4", "2026-11-14", "123", "2"]),
					],
				},
			}),
		);
		expect(mocks.append).not.toHaveBeenCalled();
	});
});
