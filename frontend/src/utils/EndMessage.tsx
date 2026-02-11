import React from "react";

import Breadcrumbs from "./Breadcrumbs";
import type { Actor, Movie } from "./types";

interface EndMessageProps {
	endMessage: string | React.ReactNode;
	loadActor: () => void;
	handleBack: () => void;
	showBackButton?: boolean;
	showTryAgainButton?: boolean;
	stack: { type: "actor" | "movie"; data: Actor | Movie }[];
}

export default function EndMessage({
	endMessage,
	loadActor,
	handleBack,
	showBackButton,
	showTryAgainButton,
	stack,
}: EndMessageProps) {
	return (
		<div className="app-container">
			<h1 className="main-title">🎬 Mmmm, Bacon 🥓</h1>
			<div className="top-bar">
				{showTryAgainButton && (
					<button className="daily-actor-btn" onClick={loadActor}>
						🔀 Start Again
					</button>
				)}
				{showBackButton && (
					<button className="back-btn" onClick={handleBack}>
						← Back
					</button>
				)}
			</div>
			{stack.length > 2 && (
				<Breadcrumbs stack={stack} onBreadcrumbClick={undefined} />
			)}

			<div className="end-overlay">
				<div className="end-message">{endMessage}</div>
			</div>
		</div>
	);
}
