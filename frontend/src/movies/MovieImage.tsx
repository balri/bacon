import type { Movie } from "../api";
import Img from "../utils/Image";

const movieContainerStyle = {
	minHeight: 130,
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
};

export default function MovieImage(movie: Movie) {
	return (
		<div style={movieContainerStyle}>
			<Img
				url={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
				alt={movie.title}
				className="movie-image"
			/>
		</div>
	);
}
