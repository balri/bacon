import { useEffect, useState } from "react";

import { getActorsForMovie, type Actor, type Movie } from "../api";
import Loading from "../utils/Loading";
import ActorList from "../actors/ActorList";
import ActorListItem from "../actors/ActorListItem";

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

	const lastSelectedActor = (() => {
		const actorsInStack = stack.filter((item) => item.type === "actor");
		if (actorsInStack.length === 0) return null;
		return actorsInStack[actorsInStack.length - 1].data as Actor;
	})();

	if (loading) {
		return <Loading />;
	}

	return (
		<div>
			<MovieCard movie={movie} />
			{lastSelectedActor && (
				<div style={{ marginBottom: "1rem" }}>
					<ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
						<ActorListItem
							actor={lastSelectedActor}
							onActorClick={() => {}}
							alreadySelected={true}
						/>
					</ul>
				</div>
			)}
			<h3 className="actors-title">Select an actor:</h3>
			{filteredActors.length > 0 ? (
				<ActorList
					actors={filteredActors}
					onActorClick={onActorClick}
				/>
			) : (
				<div className="error-message">
					❌ No cast found for this movie.
				</div>
			)}
		</div>
	);
}
