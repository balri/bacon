import { useEffect, useState } from "react";

import { getMoviesForActor, type Actor, type Movie } from "../api";
import Loading from "../utils/Loading";
import MovieList from "../movies/MovieList";

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
		<div>
			<ActorCard actor={actor} />
			<h3 className="movies-title">Select a movie:</h3>
			{filteredMovies.length > 0 ? (
				<MovieList movies={filteredMovies} onMovieClick={onMovieClick} />
			) : (
				<div className="error-message">❌ No movies found for this actor.</div>
			)}
		</div>
	);
}
