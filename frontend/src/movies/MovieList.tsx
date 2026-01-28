import type { Movie } from "../api";

import MovieListItem from "./MovieListItem";

interface MovieListProps {
	movies: Movie[];
	onMovieClick: (movie: Movie) => void;
	alreadySelected: boolean;
}

export default function MovieList({
	movies,
	onMovieClick,
	alreadySelected,
}: MovieListProps) {
	return (
		<ul className="movie-list">
			{movies && movies.length > 0 ? (
				movies.map((movie: Movie) => (
					<MovieListItem
						key={movie.id}
						movie={movie}
						onMovieClick={onMovieClick}
						alreadySelected={alreadySelected}
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
