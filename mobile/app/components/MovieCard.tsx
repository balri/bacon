import { View, Text, StyleSheet } from "react-native";
import type { Movie } from "../api";
import MovieImage from "./MovieImage";

interface MovieCardProps {
	movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
	return (
		<View style={styles.card}>
			{movie.poster_path && <MovieImage {...movie} />}
			<Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
				{movie.title}
			</Text>
			{movie.release_date && (
				<Text style={styles.info}>
					Release year: {new Date(movie.release_date).getFullYear()}
				</Text>
			)}
			{movie.vote_average && (
				<Text style={styles.info}>⭐ {movie.vote_average.toFixed(1)}</Text>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	card: {
		alignItems: "center",
		backgroundColor: "#f1f5f9",
		borderRadius: 12,
		padding: 16,
		marginBottom: 16,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.07,
		shadowRadius: 8,
		elevation: 2,
	},
	title: {
		fontSize: 22,
		fontWeight: "600",
		color: "#3730a3",
		marginTop: 12,
		marginBottom: 4,
		textAlign: "center",
	},
	info: {
		fontSize: 16,
		color: "#6366f1",
		marginBottom: 2,
		textAlign: "center",
	},
});
