import { View, Text, Pressable, StyleSheet } from "react-native";
import type { Movie } from "../api";
import MovieThumbnail from "./MovieThumbnail";

interface MovieListItemProps {
	movie: Movie;
	onMovieClick: (movie: Movie) => void;
}

export default function MovieListItem({
	movie,
	onMovieClick,
}: MovieListItemProps) {
	return (
		<Pressable style={styles.item} onPress={() => onMovieClick(movie)}>
			{movie.poster_path && <MovieThumbnail movie={movie} />}
			<View style={styles.meta}>
				<Text style={styles.title} numberOfLines={1} ellipsizeMode="tail" selectable={false}>
					{movie.title}
				</Text>
				{movie.release_date && (
					<Text style={styles.year}>
						{" "}({new Date(movie.release_date).getFullYear()})
					</Text>
				)}
				{movie.vote_average && (
					<Text style={styles.rating}>
						{" "}⭐ {movie.vote_average.toFixed(1)}
					</Text>
				)}
			</View>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	item: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 10,
		paddingHorizontal: 16,
		borderBottomWidth: 1,
		borderBottomColor: "#e5e7eb",
		backgroundColor: "#fff",
	},
	meta: {
		marginLeft: 12,
		flexDirection: "row",
		alignItems: "center",
		flexWrap: "wrap",
	},
	title: {
		fontSize: 16,
		fontWeight: "600",
		color: "#3730a3",
	},
	year: {
		fontSize: 15,
		color: "#6366f1",
		marginLeft: 4,
	},
	rating: {
		fontSize: 15,
		color: "#f59e42",
		marginLeft: 4,
	},
});
