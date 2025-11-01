import React from "react";

interface EndMessageProps {
	endMessage: string | React.ReactNode;
	loadActor: () => void;
	handleBack: () => void;
	breadcrumbs: React.ReactNode;
	showBackButton?: boolean;
}

export default function EndMessage({
	endMessage,
	loadActor,
	handleBack,
	breadcrumbs,
	showBackButton,
}: EndMessageProps) {
	return (
		<div className="app-container">
			<h1 className="main-title">🎬 Mmmm, Bacon 🥓</h1>
			<div className="top-bar">
				<button className="random-actor-btn" onClick={loadActor}>
					🔀 Play Again
				</button>
				{showBackButton && (
					<button className="back-btn" onClick={handleBack}>
						← Back
					</button>
				)}
			</div>
			{breadcrumbs}
			<div className="end-overlay">
				<div className="end-message">{endMessage}</div>
			</div>
		</div>
	);
}
