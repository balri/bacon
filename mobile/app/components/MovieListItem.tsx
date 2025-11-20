import { View, Text, Pressable } from "react-native";
import type { Movie } from "../../lib/api";
import MovieThumbnail from "./MovieThumbnail";
import { movieListItemStyles } from "../../lib/styles";

interface MovieListItemProps {
	movie: Movie;
	onMovieClick: (movie: Movie) => void;
}

export default function MovieListItem({
	movie,
	onMovieClick,
}: MovieListItemProps) {
	return (
		<Pressable style={movieListItemStyles.item} onPress={() => onMovieClick(movie)}>
			{movie.poster_path && <MovieThumbnail movie={movie} />}
			<View style={movieListItemStyles.meta}>
				<Text style={movieListItemStyles.title} numberOfLines={1} ellipsizeMode="tail" selectable={false}>
					{movie.title}
				</Text>
				{movie.release_date && (
					<Text style={movieListItemStyles.year}>
						{" "}({new Date(movie.release_date).getFullYear()})
					</Text>
				)}
				{movie.vote_average && (
					<Text style={movieListItemStyles.rating}>
						{" "}⭐ {movie.vote_average.toFixed(1)}
					</Text>
				)}
			</View>
		</Pressable>
	);
}
