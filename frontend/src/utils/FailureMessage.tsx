import type { Actor } from "../api";

interface FailureMessageProps {
	firstActor: Actor | null;
	attempts: number;
}

export default function FailureMessage({
	firstActor,
	attempts,
}: FailureMessageProps) {
	const firstActorName = firstActor?.name || "Unknown Actor";
	const firstActorPhoto = firstActor?.profile_path
		? `https://image.tmdb.org/t/p/w185${firstActor.profile_path}`
		: null;
	const baconName = "Kevin Bacon";
	const baconPhoto =
		"https://image.tmdb.org/t/p/w185/rjX2Oz3tCZMfSwOoIAyEhdtXnTE.jpg";

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				background: "#fff",
				borderRadius: 16,
				boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
				padding: 32,
				maxWidth: 400,
				margin: "40px auto",
				color: "#222",
			}}
		>
			<span
				role="img"
				aria-label="sad"
				style={{ fontSize: 48, marginBottom: 12 }}
			>
				😢
			</span>
			<h2 style={{ margin: 0, marginBottom: 8, color: "#b00020" }}>
				No Connection Found
			</h2>
			<div
				style={{
					display: "flex",
					flexDirection: "row",
					alignItems: "center",
					gap: 24,
					marginBottom: 16,
				}}
			>
				<div style={{ textAlign: "center" }}>
					{firstActorPhoto && (
						<img
							src={firstActorPhoto}
							alt={firstActorName}
							style={{
								borderRadius: 12,
								width: 100,
								height: 140,
								objectFit: "cover",
								marginBottom: 8,
								boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
							}}
						/>
					)}
					<div
						style={{ fontSize: 16, fontWeight: 500, color: "#222" }}
					>
						{firstActorName}
					</div>
				</div>
				<span style={{ fontSize: 32, color: "#b00020" }}>×</span>
				<div style={{ textAlign: "center" }}>
					<img
						src={baconPhoto}
						alt={baconName}
						style={{
							borderRadius: 12,
							width: 100,
							height: 140,
							objectFit: "cover",
							marginBottom: 8,
							boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
						}}
					/>
					<div
						style={{ fontSize: 16, fontWeight: 500, color: "#222" }}
					>
						{baconName}
					</div>
				</div>
			</div>
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					gap: 24,
					marginBottom: 16,
				}}
			>
				<div style={{ textAlign: "center" }}>
					<div style={{ fontSize: 14, color: "#555" }}>Attempts</div>
					<div
						data-testid="attempts"
						style={{
							fontSize: 22,
							fontWeight: 600,
							color: "#b00020",
						}}
					>
						{typeof attempts === "number" ? attempts : "-"}
					</div>
				</div>
			</div>
			<div style={{ color: "#555", fontSize: 15, marginTop: 8 }}>
				<em>Go Back or Start Again</em>
			</div>
		</div>
	);
}
