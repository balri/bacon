import { describe, expect, it } from "vitest";

import { getBrisbaneDate } from "../dailyActor.js";

describe("getBrisbaneDate", () => {
	it("uses the Brisbane date when UTC is still on the previous day", () => {
		expect(getBrisbaneDate(new Date("2026-03-20T14:30:00.000Z"))).toBe(
			"2026-03-21",
		);
	});
});
