import type { Movie } from "../api";
import MovieListItem from "./MovieListItem";

interface MovieListProps {
	movies: Movie[];
	onMovieClick: (movie: Movie) => void;
}

export default function MovieList({ movies, onMovieClick }: MovieListProps) {
	return (
		<ul className="movie-list">
			{movies && movies.length > 0 ? movies.map((movie: Movie) => (
				<MovieListItem movie={movie} onMovieClick={onMovieClick} />
			)) : (
				<li className="error-message">
					❌ No movies found for this actor.
				</li>
			)}
		</ul>
	);
}
