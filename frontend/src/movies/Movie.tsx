import { useEffect, useState } from "react";
import { getActorsForMovie, type Actor, type Movie } from "../api";
import Loading from "../utils/Loading";
import ActorList from "../actors/ActorList";
import MovieCard from "./MovieCard";
import { KEVIN_BACON_ID } from "../App";

interface MovieProps {
	movie: Movie;
	onActorClick: (actor: Actor) => void;
	stack: Array<{ type: "actor" | "movie"; data: Actor | Movie }>;
	onGameEnd?: (msg: React.ReactNode) => void;
}

export default function Movie({ movie, onActorClick, stack, onGameEnd }: MovieProps) {
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

	const actorIdsInStack = stack
		.filter((item) => item.type === "actor")
		.map((item) => (item.data as Actor).id);

	const filteredActors = actors
		? actors.filter((actor) => !actorIdsInStack.includes(actor.id))
		: [];

	const actorsInStackCount = actorIdsInStack.length;
	const kevinBaconInCast = actors && actors.some((a) => a.id === KEVIN_BACON_ID);

	if (
		actorsInStackCount === 5 &&
		actors &&
		!kevinBaconInCast
	) {
		onGameEnd?.(
			<div>
				<span role="img" aria-label="sad">😢</span> Better luck next time!
			</div>
		);
		return null;
	} else if (
		actors && kevinBaconInCast
	) {
		onGameEnd?.(
			<div>
				<span role="img" aria-label="trophy">🏆</span> Congratulations! You found Kevin Bacon!
			</div>
		);
		return null;
	}

	return (
		<div>
			<MovieCard movie={movie} />
			<h3 className="actors-title">Select an actor:</h3>
			{filteredActors.length > 0 ? (
				<ActorList actors={filteredActors} onActorClick={onActorClick} />
			) : (
				<div className="error-message">❌ No cast found for this movie.</div>
			)}
		</div>
	);
}
