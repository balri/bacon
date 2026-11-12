interface IntroMessageProps {
	onStart: () => void;
}

export default function IntroMessage({ onStart }: IntroMessageProps) {
	return (
		<div className="app-container">
			<h1 className="main-title">🎬 Mmmm, Bacon 🥓</h1>
			<div className="intro-overlay">
				<div className="intro-message">
					<h2>Welcome to Six Degrees of Kevin Bacon!</h2>
					<p>
						Each day, start with a random actor. Select a movie
						they've appeared in, then pick another actor from that
						movie, and so on.
						<br />
						Your goal: <b>Reach Kevin Bacon in 6 steps or less!</b>
					</p>
					<button className="daily-actor-btn" onClick={onStart}>
						Begin
					</button>
				</div>
			</div>
		</div>
	);
}
