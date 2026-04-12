import Cookies from "js-cookie";

import type { Actor, Movie } from "./types";

export const COOKIE_NAME = "bacon_game";

type CookieData = {
	completed: boolean;
	actorId?: number | null;
	degrees?: number;
	numSolved?: number | null;
	longestStreak?: number | null;
	streak?: number | null;
	stack: Array<{ type: "actor" | "movie"; data: Actor | Movie }>;
};

export function getTodayDateString() {
	return new Date().toLocaleDateString("en-CA", {
		timeZone: "Australia/Brisbane",
	});
}

export function getYesterdayDateString() {
	const today = getTodayDateString();
	const todayDate = new Date(today);
	const yesterdayDate = new Date(todayDate);
	yesterdayDate.setDate(yesterdayDate.getDate() - 1);
	return yesterdayDate.toISOString().slice(0, 10);
}

export function getCookieData(dateStr: string): CookieData | null {
	const data = getAllCookieData();
	if (data[dateStr]) {
		return data[dateStr];
	}
	return null;
}

export function getAllCookieData(): { [key: string]: CookieData } {
	const cookie = Cookies.get(COOKIE_NAME);
	if (cookie) {
		try {
			const data = JSON.parse(cookie);
			return data;
		} catch {
			return {};
		}
	}
	return {};
}

export function setCookieData(data: CookieData): CookieData {
	const allData = getAllCookieData();
	const today = getTodayDateString();
	const yesterday = getYesterdayDateString();
	const yesterdayData = allData[yesterday] || null;
	let streak = 0;
	if (yesterdayData && yesterdayData.completed) {
		streak = yesterdayData.streak || 0;
	}

	let numSolved = 0;
	let longestStreak = 0;
	for (const key in allData) {
		const entry = allData[key];
		if (entry.numSolved && entry.numSolved > numSolved) {
			numSolved = entry.numSolved;
		}
		if (entry.longestStreak && entry.longestStreak > longestStreak) {
			longestStreak = entry.longestStreak;
		}
	}

	if (numSolved === 0) {
		numSolved = streak;
	}

	if (data.completed) {
		streak += 1;
		numSolved += 1;
	}

	if (streak > longestStreak) {
		longestStreak = streak;
	}

	allData[today] = {
		...data,
		streak,
		longestStreak,
		numSolved,
	};

	const todayDate = new Date(today);
	const dateKeys = Object.keys(allData);

	for (const key of dateKeys) {
		const dataDate = new Date(key);
		const diffTime = todayDate.getTime() - dataDate.getTime();
		const diffDays = diffTime / (1000 * 60 * 60 * 24);
		if (diffDays > 2) {
			delete allData[key];
		}
	}

	Cookies.set(COOKIE_NAME, JSON.stringify(allData), { expires: 365 * 30 });

	return allData[today];
}
