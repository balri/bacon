import Cookies from "js-cookie";

export const COOKIE_NAME = "bacon_game";

type CookieData = {
	completed: boolean;
	actorId?: number | null;
	degrees?: number;
	attempts?: number | null;
	streak?: number | null;
};

// Today's date string in Brisbane timezone
export function getTodayDateString() {
	// Use Australia/Brisbane timezone and ISO format (YYYY-MM-DD)
	return new Date().toLocaleDateString("en-CA", { timeZone: "Australia/Brisbane" });
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

function getAllCookieData(): { [key: string]: CookieData } {
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
	const todayData = allData[today] || null;
	let attempts = 0;
	if (todayData) {
		attempts = todayData.attempts || 0;
	}
	attempts += 1;

	const yesterday = getYesterdayDateString();
	const yesterdayData = allData[yesterday] || null;
	let streak = 0;
	if (yesterdayData && yesterdayData.completed) {
		streak = yesterdayData.streak || 0;
	}
	if (data.completed) {
		streak += 1;
	}

	allData[today] = {
		...data,
		attempts,
		streak,
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

	Cookies.set(COOKIE_NAME, JSON.stringify(allData), { expires: 30 });

	return allData[today];
}
