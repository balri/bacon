import { View, StyleSheet } from "react-native";
import type { Movie } from "../../lib/api";
import BaseImage from "./BaseImage";

interface MovieImageProps {
	movie: Movie;
}

export default function MovieImage(movie: Movie) {
	if (!movie.poster_path) return null;
	return (
		<View style={styles.container}>
			<BaseImage
				url={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
				alt={movie.title}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		minHeight: 130,
		alignItems: "center",
		justifyContent: "center",
	},
});
