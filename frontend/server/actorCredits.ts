import { getCache, setCache } from "./cache";
import { ExternalServiceError, fetchTmdb } from "./tmdb";
import type { Actor } from "./types";

export async function actorCredits(movieId: number): Promise<Actor[]> {
	const cacheKey = `actors-${movieId}`;
	const cached = getCache<Actor[]>(cacheKey);
	if (cached) {
		return cached;
	}

	const data = await fetchTmdb<{ cast: Actor[] }>(
		`/movie/${movieId}/credits`,
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

export async function getActor(actorId: number): Promise<Actor | null> {
	try {
		return await fetchTmdb(`/person/${actorId}`);
	} catch (error) {
		if (error instanceof ExternalServiceError && error.status === 404) {
			return null;
		}
		throw error;
	}
}
