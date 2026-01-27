import type { Movie } from "../api";

import MovieThumbnail from "./MovieThumbnail";

interface MovieListItemProps {
	movie: Movie;
	onMovieClick: (movie: Movie) => void;
	alreadySelected?: boolean;
}
export default function MovieListItem({
	movie,
	onMovieClick,
	alreadySelected = false,
}: MovieListItemProps) {
	return (
		<li
			key={movie.id}
			className={alreadySelected ? "movie-item selected" : "movie-item"}
			style={
				alreadySelected
					? {
							cursor: "not-allowed",
							opacity: 0.5,
							pointerEvents: "none",
						}
					: { cursor: "pointer" }
			}
			onClick={alreadySelected ? undefined : () => onMovieClick(movie)}
		>
			{movie.poster_path && <MovieThumbnail {...movie} />}
			<span className="movie-meta">
				<span className="movie-title" title={movie.title}>
					{movie.title}
				</span>
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
			</span>
		</li>
	);
}
