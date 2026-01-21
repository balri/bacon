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
		setCookieData({ completed: true, degrees: 3 });
		const data = getCookieData(today);
		expect(data).not.toBeNull();
		expect(data?.completed).toBe(true);
		expect(data?.degrees).toBe(3);
		expect(data?.attempts).toBe(1);
		expect(data?.streak).toBe(1);
	});

	it("increments attempts on multiple sets in one day", () => {
		const today = getTodayDateString();
		setCookieData({ completed: false, degrees: 2 });
		setCookieData({ completed: false, degrees: 2 });
		const data = getCookieData(today);
		expect(data?.attempts).toBe(2);
	});

	it("increments streak if yesterday was completed", () => {
		const today = getTodayDateString();
		const yesterday = getYesterdayDateString();
		Cookies.set(
			COOKIE_NAME,
			JSON.stringify({
				[yesterday]: { completed: true, degrees: 2, streak: 1 },
			}),
			{ expires: 30 },
		);
		setCookieData({ completed: true, degrees: 3 });
		const data = getCookieData(today);
		expect(data?.streak).toBe(2);
	});

	it("resets streak if yesterday was not completed", () => {
		const today = getTodayDateString();
		const yesterday = getYesterdayDateString();
		Cookies.set(
			COOKIE_NAME,
			JSON.stringify({
				[yesterday]: { completed: false, degrees: 2, streak: 1 },
			}),
			{ expires: 30 },
		);
		setCookieData({ completed: true, degrees: 3 });
		const data = getCookieData(today);
		expect(data?.streak).toBe(1);
	});

	it("increments numSolved from highest value if yesterday is missing", () => {
		const today = getTodayDateString();
		const twoDaysAgo = (() => {
			const d = new Date(today);
			d.setDate(d.getDate() - 2);
			return d.toISOString().slice(0, 10);
		})();
		Cookies.set(
			COOKIE_NAME,
			JSON.stringify({
				[twoDaysAgo]: {
					completed: true,
					degrees: 2,
					streak: 3,
					numSolved: 5,
				},
			}),
			{ expires: 30 },
		);
		setCookieData({ completed: true, degrees: 1 });
		const data = getCookieData(today);
		expect(data?.numSolved).toBe(6);
	});
});
