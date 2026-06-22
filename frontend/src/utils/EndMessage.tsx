import React from "react";

import Breadcrumbs from "./Breadcrumbs";
import { getTodayDateString } from "./cookie";
import type { Actor, Movie } from "./types";

interface EndMessageProps {
	endMessage: string | React.ReactNode;
	stack: { type: "actor" | "movie"; data: Actor | Movie }[];
	gameNumber?: number | null;
}

export default function EndMessage({ endMessage, stack, gameNumber }: EndMessageProps) {
	const today = getTodayDateString();
	return (
		<div className="app-container">
			<h1 className="main-title">🎬 Mmmm, Bacon 🥓</h1>
			{gameNumber != null && <p className="game-number">Game #{gameNumber} · {new Date(today + "T00:00:00").toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" })}</p>}
			{stack.length > 2 && (
				<Breadcrumbs stack={stack} onBreadcrumbClick={undefined} />
			)}

			<div className="end-overlay">
				<div className="end-message">{endMessage}</div>
			</div>
		</div>
	);
}
