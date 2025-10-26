interface EndMessageProps {
	endMessage: string;
	loadActor: () => void;
	breadcrumbs: React.ReactNode;
}

export default function EndMessage({ endMessage, loadActor, breadcrumbs }: EndMessageProps) {
	return (
		<div className="app-container">
			<h1 className="main-title">🎬 Mmmm, Bacon 🥓</h1>
			<div className="top-bar">
				<button className="random-actor-btn" onClick={loadActor}>
					🔀 Play Again
				</button>
			</div>
			{breadcrumbs}
			<div className="end-overlay">
				<div className="end-message">{endMessage}</div>
			</div>
		</div>
	);
}
