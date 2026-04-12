import React, { useState, useEffect } from "react";

import { getDailyActor } from "./api";
import ActorView from "./actors/ActorView";
import Loading from "./utils/Loading";
import "./index.css";
import MovieView from "./movies/MovieView";
import Breadcrumbs from "./utils/Breadcrumbs";
import EndMessage from "./utils/EndMessage";
import IntroMessage from "./utils/IntroMessage";
import SuccessMessage from "./utils/SuccessMessage";
import {
	getTodayDateString,
	getCookieData,
	setCookieData,
	getAllCookieData,
} from "./utils/cookie";
import FailureMessage from "./utils/FailureMessage";
import {
	KEVIN_BACON_ID,
	SIX_DEGREES,
	type Actor,
	type Movie,
} from "./utils/types";

function isActor(item: {
	type: string;
	data: any;
}): item is { type: "actor"; data: Actor } {
	return item.type === "actor";
}

function App() {
	const today = getTodayDateString();

	const [showIntro, setShowIntro] = useState(() => {
		const allCookies = getAllCookieData();
		return Object.keys(allCookies).length === 0;
	});
	const [stack, setStack] = useState<
		Array<{ type: "actor" | "movie"; data: Actor | Movie }>
	>([]);
	const [loading, setLoading] = useState(true);
	const [endMessage, setEndMessage] = useState<null | {
		type: string;
		node: React.ReactNode;
	}>(null);

	useEffect(() => {
		const allCookies = getAllCookieData();
		if (Object.keys(allCookies).length === 0) {
			setShowIntro(true);
			setLoading(false);
			return;
		}
		const data = getCookieData(today);
		if (data && data.actorId) {
			setShowIntro(false);
			setLoading(true);
			(async () => {
				const actor = await getDailyActor();
				if (actor && actor.id === data.actorId) {
					if (data.stack) {
						setStack(data.stack);
					} else {
						setStack([{ type: "actor", data: actor }]);
					}
					if (data.completed) {
						setEndMessage({
							type: "success",
							node: (
								<SuccessMessage
									firstActor={actor}
									degrees={data.degrees || 0}
									numSolved={data.numSolved || 1}
									longestStreak={data.longestStreak || 1}
									streak={data.streak || 1}
								/>
							),
						});
					} else {
						setEndMessage({
							type: "failure",
							node: <FailureMessage firstActor={actor} />,
						});
					}
				}
				setLoading(false);
			})();
		} else {
			setShowIntro(false);
			loadActor();
		}
	}, [today]);

	async function loadActor() {
		setLoading(true);
		const actor = await getDailyActor();
		if (actor) {
			setStack([{ type: "actor", data: actor }]);
			setEndMessage(null);
		}
		setLoading(false);
	}

	function handleMovieClick(movie: Movie) {
		if (gameEnded) return;
		setStack((prev) => [...prev, { type: "movie", data: movie }]);
	}

	function handleActorClick(actor: Actor) {
		if (gameEnded) return;
		setStack((prev) => [...prev, { type: "actor", data: actor }]);
	}

	function handleBack() {
		setStack((prev) => prev.slice(0, -1));
		setEndMessage(null);
	}

	const actorsInStack = stack.filter(isActor);

	const lastActor = actorsInStack[actorsInStack.length - 1];
	const reachedSixActors = actorsInStack.length > SIX_DEGREES;
	const isKevinBacon = lastActor && lastActor.data.id === KEVIN_BACON_ID;
	const gameEnded = reachedSixActors || isKevinBacon || !!endMessage;

	function handleGameEnd(type: string) {
		const firstActor = actorsInStack[0].data || null;
		const actorId = firstActor?.id || null;
		const cookieData = setCookieData({
			actorId: actorId,
			completed: type === "success",
			degrees: actorsInStack.length - 1,
			stack: stack,
		});
		if (type === "success") {
			setEndMessage({
				type,
				node: (
					<SuccessMessage
						firstActor={firstActor}
						degrees={actorsInStack.length - 1 || 0}
						numSolved={cookieData.numSolved || 1}
						longestStreak={cookieData.longestStreak || 1}
						streak={cookieData.streak || 1}
					/>
				),
			});
		} else {
			setEndMessage({
				type,
				node: <FailureMessage firstActor={firstActor} />,
			});
		}
	}

	const handleBreadcrumbClick = (index: number) => {
		setStack((prev) => prev.slice(0, index + 1));
		setEndMessage(null);
	};

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

	if (loading || (!current && !endMessage)) {
		return (
			<div className="app-container">
				<h1 className="main-title">🎬 Mmmm, Bacon 🥓</h1>
				<Loading />
			</div>
		);
	}

	if (endMessage) {
		return <EndMessage endMessage={endMessage.node} stack={stack} />;
	}

	return (
		<div className="app-container">
			<h1 className="main-title">🎬 Mmmm, Bacon 🥓</h1>
			<div className="top-bar">
				{stack.length > 1 && !gameEnded && (
					<button className="back-btn" onClick={handleBack}>
						← Back
					</button>
				)}
			</div>
			<Breadcrumbs
				stack={stack}
				onBreadcrumbClick={handleBreadcrumbClick}
			/>
			{current ? (
				current.type === "actor" ? (
					<ActorView
						actor={current.data as Actor}
						onMovieClick={handleMovieClick}
						stack={stack}
						onGameEnd={handleGameEnd}
					/>
				) : (
					<MovieView
						movie={current.data as Movie}
						onActorClick={handleActorClick}
						stack={stack}
					/>
				)
			) : (
				<div className="error-message">
					❌ An error occurred. Please try again later.
				</div>
			)}
		</div>
	);
}

export default App;
