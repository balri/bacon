import type { Actor } from "../api";

type SuccessMessageProps = {
	firstActor: Actor | null;
	degrees: number;
	attempts: number;
	numSolved?: number;
	longestStreak?: number;
	streak?: number;
};

export default function SuccessMessage(props: SuccessMessageProps) {
	const {
		firstActor,
		degrees,
		attempts,
		streak: streakProp,
		longestStreak,
		numSolved,
	} = props;
	const streakVal =
		typeof streakProp === "number" && !isNaN(streakProp) ? streakProp : 1;
	const longestStreakVal =
		typeof longestStreak === "number" && !isNaN(longestStreak)
			? longestStreak
			: 0;
	const numSolvedVal =
		typeof numSolved === "number" && !isNaN(numSolved) ? numSolved : 0;
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
				aria-label="trophy"
				style={{ fontSize: 48, marginBottom: 12 }}
			>
				🏆
			</span>
			<h2 style={{ margin: 0, marginBottom: 8, color: "#222" }}>
				Congratulations!
			</h2>
			<div style={{ marginBottom: 20, color: "#444" }}>
				You completed today's challenge.
			</div>
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
				<span style={{ fontSize: 32, color: "#1a8917" }}>→</span>
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
					flexDirection: "column",
					alignItems: "center",
					gap: 8,
					marginBottom: 16,
				}}
			>
				<div
					style={{
						display: "flex",
						justifyContent: "center",
						alignItems: "stretch",
						gap: 24,
						width: "100%",
					}}
				>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							justifyContent: "flex-end",
							alignItems: "center",
							flex: 1,
							minWidth: 0,
						}}
					>
						<div
							style={{
								fontSize: 14,
								color: "#555",
								wordBreak: "break-word",
								textAlign: "center",
							}}
						>
							Degrees
						</div>
						<div
							data-testid="degrees"
							style={{
								fontSize: 22,
								fontWeight: 600,
								color: "#222",
							}}
						>
							{degrees}
						</div>
					</div>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							justifyContent: "flex-end",
							alignItems: "center",
							flex: 1,
							minWidth: 0,
						}}
					>
						<div
							style={{
								fontSize: 14,
								color: "#555",
								wordBreak: "break-word",
								textAlign: "center",
							}}
						>
							Attempts
						</div>
						<div
							data-testid="attempts"
							style={{
								fontSize: 22,
								fontWeight: 600,
								color: "#222",
							}}
						>
							{attempts}
						</div>
					</div>
					<div style={{ flex: 1 }}></div>
				</div>
				<div
					style={{
						display: "flex",
						justifyContent: "center",
						alignItems: "stretch",
						gap: 24,
						width: "100%",
					}}
				>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							justifyContent: "flex-end",
							alignItems: "center",
							flex: 1,
							minWidth: 0,
						}}
					>
						<div
							style={{
								fontSize: 14,
								color: "#555",
								wordBreak: "break-word",
								textAlign: "center",
							}}
						>
							Streak
						</div>
						<div
							data-testid="streak"
							style={{
								fontSize: 22,
								fontWeight: 600,
								color: streakVal > 1 ? "#1a8917" : "#222",
							}}
						>
							{streakVal}
						</div>
					</div>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							justifyContent: "flex-end",
							alignItems: "center",
							flex: 1,
							minWidth: 0,
						}}
					>
						<div
							style={{
								fontSize: 14,
								color: "#555",
								wordBreak: "break-word",
								textAlign: "center",
							}}
						>
							Longest Streak
						</div>
						<div
							data-testid="longest-streak"
							style={{
								fontSize: 22,
								fontWeight: 600,
								color:
									longestStreakVal > 1 ? "#1a8917" : "#222",
							}}
						>
							{longestStreakVal}
						</div>
					</div>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							justifyContent: "center",
							alignItems: "center",
							flex: 1,
							minWidth: 0,
						}}
					>
						<div
							style={{
								fontSize: 14,
								color: "#555",
								wordBreak: "break-word",
								textAlign: "center",
							}}
						>
							Total Solved
						</div>
						<div
							data-testid="num-solved"
							style={{
								fontSize: 22,
								fontWeight: 600,
								color: numSolvedVal > 0 ? "#1a8917" : "#222",
							}}
						>
							{numSolvedVal}
						</div>
					</div>
				</div>
			</div>
			<div style={{ color: "#555", fontSize: 15, marginTop: 8 }}>
				<em>Come back tomorrow for a new challenge!</em>
			</div>
		</div>
	);
}
