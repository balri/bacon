import React from "react";

import type { Actor } from "./types";

type SuccessMessageProps = {
	firstActor: Actor | null;
	degrees: number;
	numSolved?: number;
	longestStreak?: number;
	streak?: number;
};

export default function SuccessMessage(props: SuccessMessageProps) {
	const {
		firstActor,
		degrees,
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

	const shareUrl = typeof window !== "undefined" ? window.location.href : "";
	const [copied, setCopied] = React.useState(false);
	const [showManual, setShowManual] = React.useState(false);
	const handleShare = () => {
		const shareText =
			(firstActor && degrees === firstActor.bacon_number) || degrees === 1
				? `I connected ${firstActorName} to Kevin Bacon in the optimal steps! Can you do the same? Play now!`
				: `I connected ${firstActorName} to Kevin Bacon in ${degrees} steps! Can you beat my score? Play now!`;
		if (
			typeof window !== "undefined" &&
			window.navigator &&
			window.navigator.share
		) {
			window.navigator.share({
				title: "Bacon Game Challenge",
				text: shareText,
				url: shareUrl,
			});
		} else {
			setShowManual(true);
		}
	};

	const handleCopy = () => {
		if (
			typeof window !== "undefined" &&
			window.navigator &&
			window.navigator.clipboard
		) {
			window.navigator.clipboard.writeText(shareUrl).then(() => {
				setCopied(true);
				if (typeof window !== "undefined" && window.setTimeout) {
					window.setTimeout(() => setCopied(false), 2000);
				}
			});
		}
	};

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
							Optimal Steps
						</div>
						<div
							data-testid="optimal-steps"
							style={{
								fontSize: 22,
								fontWeight: 600,
								color: "#222",
							}}
						>
							{firstActor?.bacon_number != null &&
							firstActor.bacon_number > 0
								? firstActor.bacon_number
								: "-"}
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
							Your Steps
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
							Current Streak
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
			<div
				style={{
					marginTop: 16,
					marginBottom: 8,
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<button
					type="button"
					onClick={handleShare}
					style={{
						background: "#e0ffe0",
						color: "green",
						border: "1.5px solid #1a8917",
						borderRadius: "4px",
						padding: "0.4em 1em",
						fontSize: "1em",
						fontWeight: 500,
						cursor: "pointer",
						marginLeft: "0.5em",
						marginBottom: showManual ? "8px" : 0,
						display: "flex",
						alignItems: "center",
						gap: "0.4em",
					}}
				>
					Share
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						aria-hidden="true"
					>
						<path d="M6 12 L14 6" />
						<path d="M6 12 L14 18" />

						<circle cx="6" cy="12" r="2" />
						<circle cx="16" cy="6" r="2" />
						<circle cx="16" cy="18" r="2" />
					</svg>
				</button>
				{showManual && (
					<div
						style={{
							display: "flex",
							alignItems: "center",
							gap: "8px",
							marginTop: "4px",
						}}
					>
						<input
							type="text"
							value={shareUrl}
							readOnly
							style={{
								padding: "0.3em 0.7em",
								border: "1px solid #cfc",
								borderRadius: "3px",
								width: "220px",
								color: "#222",
								background: "#f6fff6",
							}}
							onFocus={(e) => e.target.select()}
						/>
						<button
							type="button"
							onClick={handleCopy}
							style={{
								background: "#e0ffe0",
								color: "green",
								border: "1px solid #cfc",
								borderRadius: "3px",
								padding: "0.3em 0.7em",
								cursor: "pointer",
							}}
						>
							Copy
						</button>
					</div>
				)}
				{copied && (
					<div
						style={{
							color: "#1a8917",
							fontWeight: 500,
							fontSize: "13px",
							marginTop: 4,
							width: "100%",
							textAlign: "center",
						}}
					>
						Link copied!
					</div>
				)}
			</div>
			<div style={{ color: "#555", fontSize: 15, marginTop: 8 }}>
				<em>Come back tomorrow for a new challenge!</em>
			</div>
		</div>
	);
}
