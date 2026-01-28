import { useEffect, useState } from "react";

import { getActorsForMovie, type Actor, type Movie } from "../api";
import Loading from "../utils/Loading";
import ActorList from "../actors/ActorList";

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

	const actorIdsInStack = stack
		.filter((item) => item.type === "actor")
		.map((item) => (item.data as Actor).id);

	const filteredActors = actors
		? actors.filter((actor) => !actorIdsInStack.includes(actor.id))
		: [];

	const selectedActors = actors
		? actors.filter((actor) => actorIdsInStack.includes(actor.id))
		: [];

	if (loading) {
		return <Loading />;
	}

	return (
		<div>
			<MovieCard movie={movie} />
			<h3 className="actors-title">Select an actor:</h3>
			{selectedActors.length > 0 && (
				<ActorList
					actors={selectedActors}
					onActorClick={() => {}}
					alreadySelected={true}
				/>
			)}
			{filteredActors.length > 0 ? (
				<ActorList
					actors={filteredActors}
					onActorClick={onActorClick}
					alreadySelected={false}
				/>
			) : (
				<div className="error-message">
					❌ No cast found for this movie.
				</div>
			)}
		</div>
	);
}
