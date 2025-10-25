import { TMDB_KEY } from ".";
import { getCache, setCache } from "./cache";
import { EXCLUDED_GENRES, MAINSTREAM_GENRES, Movie, TMDB_BASE_URL } from "./types";

function isMainstreamMovie(movie: Movie): boolean {
	const hasGenres = Array.isArray(movie.genre_ids) && movie.genre_ids.length > 0;
	const hasMainstreamGenre =
		hasGenres && movie.genre_ids.some((g: number) => MAINSTREAM_GENRES.includes(g));

	return (
		!movie.adult &&
		movie.original_language === "en" &&
		hasMainstreamGenre &&
		!movie.genre_ids.some((g: number) => EXCLUDED_GENRES.includes(g)) &&
		!!movie.release_date &&
		movie.vote_average > 0 &&
		movie.vote_count > 0
	);
}

function isSafeActor(movies: Movie[], originalLength: number): boolean {
	return movies.length >= 3 && movies.length / originalLength > 0.3;
}

export const movieCredits = async (actorId: number): Promise<Movie[]> => {
	const cacheKey = `movies-${actorId}`;
	const cached = getCache(cacheKey);
	if (cached) return cached;

	const resp = await fetch(
		`${TMDB_BASE_URL}/person/${actorId}/movie_credits?api_key=${TMDB_KEY}`
	);
	const data = (await resp.json()) as { cast: Movie[] };

	const movies = data.cast.filter(isMainstreamMovie);
	if (!isSafeActor(movies, data.cast.length)) {
		setCache(cacheKey, [], 3600);
		return [];
	}
	setCache(cacheKey, movies, 3600);
	console.log(`ActorID: ${actorId}, movies: ${movies.length}`);
	return movies;
};
