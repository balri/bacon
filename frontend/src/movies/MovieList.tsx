import type { Actor, Movie } from "../utils/types";

import MovieListItem from "./MovieListItem";

interface MovieListProps {
	movies: Movie[];
	onMovieClick: (movie: Movie) => void;
	stack: Array<{ type: "actor" | "movie"; data: Actor | Movie }>;
}

export default function MovieList({
	movies,
	onMovieClick,
	stack,
}: MovieListProps) {
	const movieIdsInStack = stack
		.filter((item) => item.type === "movie")
		.map((item) => (item.data as Movie).id);

	return (
		<ul className="movie-list">
			{movies && movies.length > 0 ? (
				movies.map((movie: Movie) => (
					<MovieListItem
						key={movie.id}
						movie={movie}
						onMovieClick={onMovieClick}
						alreadySelected={movieIdsInStack.includes(movie.id)}
					/>
				))
			) : (
				<li className="error-message">
					❌ No movies found for this actor.
				</li>
			)}
		</ul>
	);
}
