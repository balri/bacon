import React, { useState } from "react";

import type { Actor as ActorType, Movie as MovieType } from "./api";
import { getDailyActor } from "./api";
import ActorView from "./actors/ActorView";
import Loading from "./utils/Loading";
import "./index.css";
import MovieView from "./movies/MovieView";
import Breadcrumbs from "./utils/Breadcrumbs";
import EndMessage from "./utils/EndMessage";
import IntroMessage from "./utils/IntroMessage";

export const KEVIN_BACON_ID = 4724;
export const SIX_DEGREES = 6;

function isActor(item: {
	type: string;
	data: any;
}): item is { type: "actor"; data: ActorType } {
	return item.type === "actor";
}

function App() {
	const [showIntro, setShowIntro] = useState(true);
	const [stack, setStack] = useState<
		Array<{ type: "actor" | "movie"; data: ActorType | MovieType }>
	>([]);
	const [loading, setLoading] = useState(true);
	const [endMessage, setEndMessage] = useState<null | {
		type: string;
		node: React.ReactNode;
	}>(null);

	async function loadActor() {
		setLoading(true);
		const actor = await getDailyActor();
		if (actor) {
			setStack([{ type: "actor", data: actor }]);
			setEndMessage(null);
		}
		setLoading(false);
	}

	function handleMovieClick(movie: MovieType) {
		if (gameEnded) return;
		setStack((prev) => [...prev, { type: "movie", data: movie }]);
	}

	function handleActorClick(actor: ActorType) {
		if (gameEnded) return;
		setStack((prev) => [...prev, { type: "actor", data: actor }]);
	}

	function handleBack() {
		setStack((prev) => prev.slice(0, -1));
		setEndMessage(null);
	}

	// Find all actors in the stack
	const actorsInStack = stack.filter(isActor);

	// Game end logic
	const lastActor = actorsInStack[actorsInStack.length - 1];
	const reachedSixActors = actorsInStack.length > SIX_DEGREES;
	const isKevinBacon = lastActor && lastActor.data.id === KEVIN_BACON_ID;
	const gameEnded = reachedSixActors || isKevinBacon || !!endMessage;

	// Breadcrumbs
	const breadcrumbs = <Breadcrumbs stack={stack} />;

	const current = stack[stack.length - 1];

	if (showIntro) {
		return (
			<IntroMessage
				onStart={() => {
					setShowIntro(false);
					loadActor();
				}}
			/>
		);
	}

	if (loading) {
		return (
			<div className="app-container">
				<h1 className="main-title">🎬 Mmmm, Bacon 🥓</h1>
				<Loading />
			</div>
		);
	}

	if (endMessage) {
		const isSuccess = endMessage.type === "success";
		return (
			<EndMessage
				endMessage={endMessage.node}
				loadActor={loadActor}
				handleBack={handleBack}
				breadcrumbs={breadcrumbs}
				showBackButton={!isSuccess}
			/>
		);
	}

	return (
		<div className="app-container">
			<h1 className="main-title">🎬 Mmmm, Bacon 🥓</h1>
			<div className="top-bar">
				<button className="random-actor-btn" onClick={loadActor}>
					🔀 Start Again
				</button>
				{stack.length > 1 && !gameEnded && (
					<button className="back-btn" onClick={handleBack}>
						← Back
					</button>
				)}
			</div>
			{breadcrumbs}
			{current ? (
				!endMessage && current.type === "actor" ? (
					<ActorView
						actor={current.data as ActorType}
						onMovieClick={handleMovieClick}
						stack={stack}
						onGameEnd={setEndMessage}
					/>
				) : (
					<MovieView
						movie={current.data as MovieType}
						onActorClick={handleActorClick}
						stack={stack}
					/>
				)
			) : (
				<div className="error-message">
					❌ An error occurred. Please try again.
				</div>
			)}
		</div>
	);
}

export default App;
