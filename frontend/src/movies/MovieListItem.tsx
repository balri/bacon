import type { Movie } from "../api";
import MovieThumbnail from "./MovieThumbnail";

interface MovieListItemProps {
	movie: Movie;
	onMovieClick: (movie: Movie) => void;
}

export default function MovieListItem({ movie, onMovieClick }: MovieListItemProps) {
	return (
		<li
			key={movie.id}
			className="movie-item"
			style={{ cursor: "pointer" }}
			onClick={() => onMovieClick(movie)}
		>
			{movie.poster_path && (
				<MovieThumbnail {...movie} />
			)}
			<span className="movie-title">{movie.title}</span>
			{movie.release_date && (
				<span className="movie-year">
					{" "}
					({new Date(movie.release_date).getFullYear()})
				</span>
			)}
			{movie.vote_average && (
				<span className="movie-rating">
					{" "}
					⭐ {movie.vote_average.toFixed(1)}
				</span>
			)}
		</li>
	);
}
