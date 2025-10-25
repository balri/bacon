import { useEffect, useState } from "react";
import { getMoviesForActor, type Actor, type Movie } from "../api";
import Loading from "../utils/Loading";
import ActorCard from "./ActorCard";
import MovieList from "../movies/MovieList";

interface ActorProps {
	actor: Actor;
	onMovieClick: (movie: Movie) => void;
}

export default function Actor({ actor, onMovieClick }: ActorProps) {
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

	return (
		<div>
			<ActorCard actor={actor} />
			<h3 className="movies-title">Select a movie:</h3>
			{movies && movies.length > 0 ? (
				<MovieList movies={movies} onMovieClick={onMovieClick} />
			) : (
				<div className="error-message">❌ No movies found for this actor.</div>
			)}
		</div>
	);
}
