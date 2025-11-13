import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";

import { getMoviesForActor, type Actor, type Movie } from "../api";
import Loading from "./Loading";
import MovieList from "./MovieList";
import ActorCard from "./ActorCard";

interface ActorProps {
	actor: Actor;
	onMovieClick: (movie: Movie) => void;
	stack: Array<{ type: "actor" | "movie"; data: Actor | Movie }>;
}

export default function ActorView({ actor, onMovieClick, stack }: ActorProps) {
	const [movies, setMovies] = useState<Movie[] | null>(null);
	const [loading, setLoading] = useState(true);

	async function loadMovies() {
		setLoading(true);
		const movies = await getMoviesForActor(actor.id);
		setMovies(movies);
		setLoading(false);
	}

	useEffect(() => {
		loadMovies();
	}, [actor.id]);

	if (loading) {
		return <Loading />;
	}

	const movieIdsInStack = stack
		.filter((item) => item.type === "movie")
		.map((item) => (item.data as Movie).id);

	const filteredMovies = movies
		? movies.filter((movie) => !movieIdsInStack.includes(movie.id))
		: [];

	return (
		<View style={styles.container}>
			<ActorCard actor={actor} />
			<Text style={styles.title}>Select a movie:</Text>
			{filteredMovies.length > 0 ? (
				<MovieList
					movies={filteredMovies}
					onMovieClick={onMovieClick}
				/>
			) : (
				<Text style={styles.error}>❌ No movies found for this actor.</Text>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
	},
	title: {
		fontSize: 18,
		fontWeight: "bold",
		marginVertical: 12,
		color: "#3730a3",
	},
	error: {
		color: "#b91c1c",
		fontSize: 16,
		marginTop: 16,
		textAlign: "center",
	},
});
