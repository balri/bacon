import type { Movie } from "../api";
import Image from "../utils/Image";

const movieContainerStyle = {
	minHeight: 130,
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
};

export default function MovieImage(movie: Movie) {
	return (
		<div style={movieContainerStyle}>
			<Image
				url={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
				alt={movie.title}
				className="movie-image"
			/>
		</div>
	);
}
