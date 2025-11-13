import type { Movie } from "../api";
import BaseImage from "./BaseImage";

interface MovieThumbnailProps {
	movie: Movie;
}

export default function MovieThumbnail({ movie }: MovieThumbnailProps) {
	if (!movie.poster_path) {
		return null;
	}

	return (
		<BaseImage
			url={`https://image.tmdb.org/t/p/w45${movie.poster_path}`}
			alt={movie.title}
			isThumbnail={true}
		/>
	);
}
