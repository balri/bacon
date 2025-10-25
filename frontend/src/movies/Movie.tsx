import { useEffect, useState } from "react";
import { getActorsForMovie, type Actor, type Movie } from "../api";
import Loading from "../utils/Loading";
import ActorList from "../actors/ActorList";
import MovieCard from "./MovieCard";

interface MovieProps {
	movie: Movie;
	onActorClick: (actor: Actor) => void;
}

export default function Movie({ movie, onActorClick }: MovieProps) {
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
				<ActorList actors={actors} onActorClick={onActorClick} />
			) : (
				<div className="error-message">❌ No cast found for this movie.</div>
			)}
		</div>
	);
}
