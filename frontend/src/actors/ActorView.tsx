import { useEffect, useState, useRef } from "react";

import { getMoviesForActor, type Actor, type Movie } from "../api";
import Loading from "../utils/Loading";
import MovieList from "../movies/MovieList";
import { KEVIN_BACON_ID, SIX_DEGREES } from "../App";

import ActorCard from "./ActorCard";

interface ActorProps {
	actor: Actor;
	onMovieClick: (movie: Movie) => void;
	stack: Array<{ type: "actor" | "movie"; data: Actor | Movie }>;
	onGameEnd?: (type: string) => void;
}

export default function ActorView({
	actor,
	onMovieClick,
	stack,
	onGameEnd,
}: ActorProps) {
	const gameEndCalled = useRef(false);
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

	const movieIdsInStack = stack
		.filter((item) => item.type === "movie")
		.map((item) => (item.data as Movie).id);

	const filteredMovies = movies
		? movies.filter((movie) => !movieIdsInStack.includes(movie.id))
		: [];

	const selectedMovies = movies
		? movies.filter((movie) => movieIdsInStack.includes(movie.id))
		: [];

	const actorsInStackCount = stack.filter(
		(item) => item.type === "actor",
	).length;
	const isKevinBacon = actor.id === KEVIN_BACON_ID;

	useEffect(() => {
		if (gameEndCalled.current) return;
		if (isKevinBacon) {
			gameEndCalled.current = true;
			onGameEnd?.("success");
		} else if (actorsInStackCount > SIX_DEGREES) {
			gameEndCalled.current = true;
			onGameEnd?.("failure");
		}
	}, [actorsInStackCount, isKevinBacon, onGameEnd]);

	if (loading) {
		return <Loading />;
	}

	if (actorsInStackCount > SIX_DEGREES || isKevinBacon) {
		return null;
	}

	return (
		<div>
			<ActorCard actor={actor} />
			<h3 className="movies-title">Select a movie:</h3>
			{selectedMovies.length > 0 && (
				<MovieList
					movies={selectedMovies}
					onMovieClick={() => {}}
					alreadySelected={true}
				/>
			)}
			{filteredMovies.length > 0 ? (
				<MovieList
					movies={filteredMovies}
					onMovieClick={onMovieClick}
					alreadySelected={false}
				/>
			) : (
				<div className="error-message">
					❌ No movies found for this actor.
				</div>
			)}
		</div>
	);
}
