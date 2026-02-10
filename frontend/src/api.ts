import type { Actor, Movie } from "./utils/types";

const BASE_URL =
	import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/bacon/api";

export async function getDailyActor(): Promise<Actor | null> {
	const res = await fetch(`${BASE_URL}/daily-actor`);
	if (!res.ok) {
		return null;
	}
	return res.json();
}

export async function getMoviesForActor(
	actorId: number,
): Promise<Movie[] | null> {
	const res = await fetch(`${BASE_URL}/movies/${actorId}`);
	if (!res.ok) {
		return null;
	}
	return res.json();
}

export async function getActorsForMovie(
	movieId: number,
): Promise<Actor[] | null> {
	const res = await fetch(`${BASE_URL}/actors/${movieId}`);
	if (!res.ok) {
		return null;
	}
	return res.json();
}
