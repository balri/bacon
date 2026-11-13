import { actorCredits } from "./actorCredits.js";
import { movieCredits } from "./movieCredits.js";

const KEVIN_BACON_ID = 4724;

type BaconNumberPathStep = {
	actorId: number;
	actorName: string;
	movieId?: number;
	movieTitle?: string;
};

export type BaconNumberResult = {
	path: BaconNumberPathStep[];
	depth: number;
};

export async function getBaconNumber(
	startActorId: number,
	maxDepth = 6,
	timeoutMs = 30_000,
): Promise<BaconNumberResult | null> {
	if (startActorId === KEVIN_BACON_ID) {
		return {
			path: [{ actorId: startActorId, actorName: "Kevin Bacon" }],
			depth: 0,
		};
	}

	const visited = new Set<number>();
	const queue: {
		actorId: number;
		depth: number;
		path: BaconNumberPathStep[];
	}[] = [{ actorId: startActorId, depth: 0, path: [] }];
	const deadline = timeoutMs > 0 ? Date.now() + timeoutMs : Infinity;

	while (queue.length > 0) {
		if (deadline - Date.now() <= 0) {
			return null;
		}
		const current = queue.shift();
		if (!current) {
			break;
		}
		const { actorId, depth, path } = current;
		if (depth > maxDepth) {
			continue;
		}
		visited.add(actorId);

		const movieTimeout =
			timeoutMs > 0 ? Math.max(1, deadline - Date.now()) : undefined;
		const movies = await movieCredits(actorId, true, movieTimeout);

		for (const movie of movies) {
			if (deadline - Date.now() <= 0) {
				return null;
			}
			const castTimeout =
				timeoutMs > 0 ? Math.max(1, deadline - Date.now()) : undefined;
			const cast = await actorCredits(movie.id, castTimeout);
			for (const actor of cast) {
				if (actor.id === KEVIN_BACON_ID) {
					return {
						path: [
							...path,
							{
								actorId: actor.id,
								actorName: actor.name,
								movieId: movie.id,
								movieTitle: movie.title,
							},
						],
						depth: depth + 1,
					};
				}
				if (!visited.has(actor.id)) {
					visited.add(actor.id);
					queue.push({
						actorId: actor.id,
						depth: depth + 1,
						path: [
							...path,
							{
								actorId: actor.id,
								actorName: actor.name,
								movieId: movie.id,
								movieTitle: movie.title,
							},
						],
					});
				}
			}
		}
	}

	return null;
}
