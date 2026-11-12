import { useEffect, useState } from "react";

import { getActorsForMovie } from "../api";
import Loading from "../utils/Loading";
import ActorList from "../actors/ActorList";
import type { Movie, Actor } from "../utils/types";

import MovieCard from "./MovieCard";

interface MovieProps {
	movie: Movie;
	onActorClick: (actor: Actor) => void;
	stack: Array<{ type: "actor" | "movie"; data: Actor | Movie }>;
}

export default function MovieView({ movie, onActorClick, stack }: MovieProps) {
	const [actors, setActors] = useState<Actor[] | null>(null);
	const [loading, setLoading] = useState(false);

	async function loadActors() {
		setLoading(true);
		const actors = await getActorsForMovie(movie.id);
		setActors(actors);
		setLoading(false);
	}

	useEffect(() => {
		loadActors();
	}, [movie.id]);

	if (loading) {
		return <Loading />;
	}

	return (
		<div>
			<MovieCard movie={movie} />
			<h3 className="actors-title">Select an actor:</h3>
			{actors && actors.length > 0 ? (
				<ActorList
					actors={actors}
					onActorClick={onActorClick}
					stack={stack}
				/>
			) : (
				<div className="error-message">
					❌ No cast found for this movie.
				</div>
			)}
		</div>
	);
}
