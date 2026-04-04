import React from "react";

import Breadcrumbs from "./Breadcrumbs";
import type { Actor, Movie } from "./types";

interface EndMessageProps {
	endMessage: string | React.ReactNode;
	stack: { type: "actor" | "movie"; data: Actor | Movie }[];
}

export default function EndMessage({ endMessage, stack }: EndMessageProps) {
	return (
		<div className="app-container">
			<h1 className="main-title">🎬 Mmmm, Bacon 🥓</h1>
			{stack.length > 2 && (
				<Breadcrumbs stack={stack} onBreadcrumbClick={undefined} />
			)}

			<div className="end-overlay">
				<div className="end-message">{endMessage}</div>
			</div>
		</div>
	);
}
