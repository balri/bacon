import { View, Text, FlatList, StyleSheet } from "react-native";
import type { Movie } from "../../lib/api";
import MovieListItem from "./MovieListItem";
import { movieListStyles } from "../../lib/styles";

interface MovieListProps {
	movies: Movie[];
	onMovieClick: (movie: Movie) => void;
}

export default function MovieList({ movies, onMovieClick }: MovieListProps) {
	if (!movies || movies.length === 0) {
		return (
			<View style={movieListStyles.errorContainer}>
				<Text style={movieListStyles.errorText}>
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
			contentContainerStyle={movieListStyles.list}
		/>
	);
}
