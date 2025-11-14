import { View, Text, FlatList, StyleSheet } from "react-native";
import type { Movie } from "../../lib/api";
import MovieListItem from "./MovieListItem";

interface MovieListProps {
	movies: Movie[];
	onMovieClick: (movie: Movie) => void;
}

export default function MovieList({ movies, onMovieClick }: MovieListProps) {
	if (!movies || movies.length === 0) {
		return (
			<View style={styles.errorContainer}>
				<Text style={styles.errorText}>
					❌ No movies found for this actor.
				</Text>
			</View>
		);
	}

	return (
		<FlatList
			data={movies}
			keyExtractor={(item) => item.id.toString()}
			renderItem={({ item }) => (
				<MovieListItem movie={item} onMovieClick={onMovieClick} />
			)}
			contentContainerStyle={styles.list}
		/>
	);
}

const styles = StyleSheet.create({
	list: {
		paddingVertical: 8,
	},
	errorContainer: {
		alignItems: "center",
		padding: 16,
	},
	errorText: {
		color: "#b91c1c",
		fontSize: 16,
	},
});
