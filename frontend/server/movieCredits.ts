import { getCache, setCache } from "./cache.js";
import { fetchTmdb } from "./tmdb.js";
import { EXCLUDED_GENRES, MAINSTREAM_GENRES, type Movie } from "./types.js";

function isMainstreamMovie(movie: Movie): boolean {
	const hasMainstreamGenre =
		Array.isArray(movie.genre_ids) &&
		movie.genre_ids.some((genre) => MAINSTREAM_GENRES.includes(genre));

	return (
		!movie.adult &&
		movie.original_language === "en" &&
		hasMainstreamGenre &&
		!movie.genre_ids.some((genre) => EXCLUDED_GENRES.includes(genre)) &&
		!!movie.release_date &&
		movie.vote_average > 0 &&
		movie.vote_count > 0
	);
}

export async function movieCredits(
	actorId: number,
	filterMovies = true,
): Promise<Movie[]> {
	const cacheKey = `movies-${actorId}-${filterMovies ? "filtered" : "all"}`;
	const cached = getCache<Movie[]>(cacheKey);
	if (cached) {
		return cached;
	}

	const data = await fetchTmdb<{ cast: Movie[] }>(
		`/person/${actorId}/movie_credits`,
	);

	const movies = filterMovies
		? data.cast.filter(isMainstreamMovie)
		: data.cast;
	setCache(cacheKey, movies, 3600);
	return movies;
}
