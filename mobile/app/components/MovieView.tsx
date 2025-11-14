import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";

import { getActorsForMovie, type Actor, type Movie } from "../../lib/api";
import Loading from "./Loading";
import ActorList from "./ActorList";
import { KEVIN_BACON_ID, SIX_DEGREES } from "../index";
import SuccessMessage from "./SuccessMessage";
import MovieCard from "./MovieCard";

interface MovieProps {
	movie: Movie;
	onActorClick: (actor: Actor) => void;
	stack: Array<{ type: "actor" | "movie"; data: Actor | Movie }>;
	onGameEnd?: (msg: { type: string; node: React.ReactNode }) => void;
}

export default function MovieView({
	movie,
	onActorClick,
	stack,
	onGameEnd,
}: MovieProps) {
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

	const actorsInStackCount = actorIdsInStack.length;
	const kevinBaconInCast =
		actors && actors.some((a) => a.id === KEVIN_BACON_ID);

	useEffect(() => {
		if (!actors) return;
		const firstActor =
			(stack.find((item) => item.type === "actor")?.data as Actor) ?? null;

		if (actorsInStackCount >= SIX_DEGREES && !kevinBaconInCast) {
			onGameEnd?.({
				type: "failure",
				node: (
					<Text style={styles.errorMessage}>
						{"😢 You have failed to link "}
						{firstActor?.name}
						{" to Kevin Bacon with 6 degrees of separation!\nGo back or start again."}
					</Text>
				),
			});
		} else if (kevinBaconInCast) {
			const lastActor = actors.find((a) => a.id === KEVIN_BACON_ID) ?? null;
			onGameEnd?.({
				type: "success",
				node: (
					<SuccessMessage
						firstActor={firstActor}
						lastActor={lastActor}
						movie={movie}
						degrees={actorsInStackCount}
					/>
				),
			});
		}
	}, [actors, actorsInStackCount, kevinBaconInCast, onGameEnd, stack, movie]);

	if (loading) {
		return <Loading />;
	}

	if (
		(actorsInStackCount >= SIX_DEGREES && actors && !kevinBaconInCast) ||
		(actors && kevinBaconInCast)
	) {
		return null;
	}

	return (
		<View style={styles.container}>
			<MovieCard movie={movie} />
			<Text style={styles.title}>Select an actor:</Text>
			{filteredActors.length > 0 ? (
				<ActorList actors={filteredActors} onActorClick={onActorClick} />
			) : (
				<Text style={styles.errorMessage}>
					❌ No cast found for this movie.
				</Text>
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
	errorMessage: {
		color: "#b91c1c",
		fontSize: 16,
		marginTop: 16,
		textAlign: "center",
	},
});
