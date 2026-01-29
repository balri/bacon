import React, { useState, useEffect } from "react";

import type { Actor as ActorType, Movie as MovieType } from "./api";
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

export const KEVIN_BACON_ID = 4724;
export const SIX_DEGREES = 6;

function isActor(item: {
	type: string;
	data: any;
}): item is { type: "actor"; data: ActorType } {
	return item.type === "actor";
}

function App() {
	const today = getTodayDateString();

	const [showIntro, setShowIntro] = useState(() => {
		const allCookies = getAllCookieData();
		return Object.keys(allCookies).length === 0;
	});
	const [stack, setStack] = useState<
		Array<{ type: "actor" | "movie"; data: ActorType | MovieType }>
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
		if (data && data.completed && data.actorId) {
			setShowIntro(false);
			setLoading(true);
			(async () => {
				const actor = await getDailyActor();
				if (actor && actor.id === data.actorId) {
					setStack([{ type: "actor", data: actor }]);
					setEndMessage({
						type: "success",
						node: (
							<SuccessMessage
								firstActor={actor}
								degrees={data.degrees || 0}
								attempts={data.attempts || 1}
								numSolved={data.numSolved || 1}
								longestStreak={data.longestStreak || 1}
								streak={data.streak || 1}
							/>
						),
					});
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
		});
		if (type === "success") {
			setEndMessage({
				type,
				node: (
					<SuccessMessage
						firstActor={firstActor}
						degrees={actorsInStack.length - 1 || 0}
						attempts={cookieData.attempts || 1}
						numSolved={cookieData.numSolved || 1}
						longestStreak={cookieData.longestStreak || 1}
						streak={cookieData.streak || 1}
					/>
				),
			});
		} else {
			setEndMessage({
				type,
				node: (
					<FailureMessage
						firstActor={firstActor}
						attempts={cookieData.attempts || 1}
					/>
				),
			});
		}
	}

	const showBreadcrumbs = !endMessage;
	const handleBreadcrumbClick = (index: number) => {
		setStack((prev) => prev.slice(0, index + 1));
		setEndMessage(null);
	};
	const breadcrumbs = showBreadcrumbs ? (
		<Breadcrumbs stack={stack} onBreadcrumbClick={handleBreadcrumbClick} />
	) : null;

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
				breadcrumbs={isSuccess ? null : breadcrumbs}
				showBackButton={!isSuccess}
				showTryAgainButton={endMessage.type === "failure"}
			/>
		);
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
			{stack.length > 1 && breadcrumbs}
			{current ? (
				!endMessage && current.type === "actor" ? (
					<ActorView
						actor={current.data as ActorType}
						onMovieClick={handleMovieClick}
						stack={stack}
						onGameEnd={handleGameEnd}
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
