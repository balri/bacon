import { getCache, setCache } from "./cache.js";
import { movieCredits } from "./movieCredits.js";
import { ExternalServiceError, fetchTmdb } from "./tmdb.js";
import type { Actor } from "./types.js";

export async function actorCredits(
	movieId: number,
	timeoutMs?: number,
): Promise<Actor[]> {
	const cacheKey = `actors-${movieId}`;
	const cached = getCache<Actor[]>(cacheKey);
	if (cached) {
		return cached;
	}

	const data = await fetchTmdb<{ cast: Actor[] }>(
		`/movie/${movieId}/credits`,
		timeoutMs,
	);

	const actors = data.cast.filter(
		(actor) =>
			!actor.adult &&
			actor.profile_path &&
			actor.known_for_department === "Acting",
	);
	setCache(cacheKey, actors, 3600);
	return actors;
}

export async function getRandomActor(timeoutMs: number): Promise<Actor | null> {
	const deadline = Date.now() + timeoutMs;
	const remainingMs = () => Math.max(0, deadline - Date.now());
	let retries = 0;

	while (retries < 10 && remainingMs() > 0) {
		const page = Math.floor(Math.random() * 500) + 1;
		const pageCacheKey = `random-actor-page-${page}`;
		let actors = getCache<Actor[]>(pageCacheKey);
		if (!actors) {
			const data = await fetchTmdb<{ results: Actor[] }>(
				`/person/popular?page=${page}`,
				remainingMs(),
			);
			actors = data.results;
			setCache(pageCacheKey, actors, 3600);
		}

		const shuffled = [...actors].sort(() => Math.random() - 0.5);
		for (const actor of shuffled) {
			if (
				!actor.profile_path ||
				actor.known_for_department !== "Acting" ||
				actor.adult
			) {
				continue;
			}
			if (remainingMs() <= 0) {
				return null;
			}

			const movies = await movieCredits(actor.id, true, remainingMs());
			if (movies.length >= 5) {
				return actor;
			}
		}
		retries++;
	}

	return null;
}

export async function getActor(
	actorId: number,
	timeoutMs?: number,
): Promise<Actor | null> {
	try {
		return await fetchTmdb(`/person/${actorId}`, timeoutMs);
	} catch (error) {
		if (error instanceof ExternalServiceError && error.status === 404) {
			return null;
		}
		throw error;
	}
}
