import type { Actor } from "../api";

interface SuccessMessageProps {
	firstActor: Actor | null;
	lastActor: Actor | null;
	movie: { title: string };
	degrees: number;
}

export default function SuccessMessage({ firstActor, lastActor, movie, degrees }: SuccessMessageProps) {
	const character = lastActor?.character || "an unknown character";
	const lastActorName = lastActor?.name || "Kevin Bacon";
	const firstActorName = firstActor?.name || "Unknown Actor";
	const profilePath = lastActor?.profile_path;

	return (
		<div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
			{profilePath && (
				<img
					src={`https://image.tmdb.org/t/p/w185${profilePath}`}
					alt={lastActorName}
					style={{
						borderRadius: "8px",
						width: "120px",
						height: "auto",
						marginBottom: "1rem",
						boxShadow: "0 2px 12px rgba(0,0,0,0.15)"
					}}
				/>
			)}
			<div>
				<span role="img" aria-label="trophy">🏆</span> Congratulations!<br />
				{lastActorName} played {character} in <b>{movie.title}</b>.<br />
				You have linked {firstActorName} to {lastActorName} with {degrees} degrees of separation!
			</div>
		</div>
	);
}
