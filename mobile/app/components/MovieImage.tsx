import { View, StyleSheet } from "react-native";
import type { Movie } from "../../lib/api";
import BaseImage from "./BaseImage";
import { movieImageStyles } from "../../lib/styles";

interface MovieImageProps {
	movie: Movie;
}

export default function MovieImage(movie: Movie) {
	if (!movie.poster_path) return null;
	return (
		<View style={movieImageStyles.container}>
			<BaseImage
				url={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
				alt={movie.title}
			/>
		</View>
	);
}
