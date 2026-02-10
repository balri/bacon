import type { Movie } from "../utils/types";

import MovieImage from "./MovieImage";

interface MovieCardProps {
	movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
	return (
		<div className="movie-card">
			{movie.poster_path && <MovieImage {...movie} />}
			<h2 className="movie-title" title={movie.title}>
				{movie.title}
			</h2>
			{movie.release_date && (
				<p>
					Release year: {new Date(movie.release_date).getFullYear()}
				</p>
			)}
			{movie.vote_average && <p>⭐ {movie.vote_average.toFixed(1)}</p>}
		</div>
	);
}
