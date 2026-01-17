import { describe, it, expect, beforeEach } from "vitest";
import Cookies from "js-cookie";

import {
	setCookieData,
	getCookieData,
	getTodayDateString,
	getYesterdayDateString,
	COOKIE_NAME,
} from "../cookie";

describe("cookie utils", () => {
	beforeEach(() => {
		Cookies.remove("bacon_game");
	});

	it("sets and gets cookie data for today", () => {
		const today = getTodayDateString();
		setCookieData({ completed: true, steps: 3 });
		const data = getCookieData(today);
		expect(data).not.toBeNull();
		expect(data?.completed).toBe(true);
		expect(data?.steps).toBe(3);
		expect(data?.attempts).toBe(1);
		expect(data?.streak).toBe(1);
	});

	it("increments attempts on multiple sets in one day", () => {
		const today = getTodayDateString();
		setCookieData({ completed: false, steps: 2 });
		setCookieData({ completed: false, steps: 2 });
		const data = getCookieData(today);
		expect(data?.attempts).toBe(2);
	});

	it("increments streak if yesterday was completed", () => {
		const today = getTodayDateString();
		const yesterday = getYesterdayDateString();
		Cookies.set(
			COOKIE_NAME,
			JSON.stringify({
				[yesterday]: { completed: true, steps: 2, streak: 1 },
			}),
			{ expires: 30 },
		);
		setCookieData({ completed: true, steps: 3 });
		const data = getCookieData(today);
		expect(data?.streak).toBe(2);
	});

	it("resets streak if yesterday was not completed", () => {
		const today = getTodayDateString();
		const yesterday = getYesterdayDateString();
		Cookies.set(
			COOKIE_NAME,
			JSON.stringify({
				[yesterday]: { completed: false, steps: 2, streak: 1 },
			}),
			{ expires: 30 },
		);
		setCookieData({ completed: true, steps: 3 });
		const data = getCookieData(today);
		expect(data?.streak).toBe(1);
	});
});
