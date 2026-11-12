import Image from "../utils/Image";
import type { Movie } from "../utils/types";

export default function MovieThumbnail(movie: Movie) {
	if (!movie.poster_path) {
		return null;
	}

	return (
		<>
			<Image
				url={`https://image.tmdb.org/t/p/w45${movie.poster_path}`}
				alt={movie.title}
				className="movie-thumbnail"
				isThumbnail={true}
			/>
		</>
	);
}
