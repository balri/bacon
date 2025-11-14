import { View, Text, Image, StyleSheet } from "react-native";
import type { Actor } from "../../lib/api";

interface SuccessMessageProps {
	firstActor: Actor | null;
	lastActor: Actor | null;
	movie: { title: string };
	degrees: number;
}

export default function SuccessMessage({
	firstActor,
	lastActor,
	movie,
	degrees,
}: SuccessMessageProps) {
	const character = lastActor?.character || "an unknown character";
	const lastActorName = lastActor?.name || "Kevin Bacon";
	const firstActorName = firstActor?.name || "Unknown Actor";
	const profilePath = lastActor?.profile_path;

	return (
		<View style={styles.container}>
			{profilePath ? (
				<Image
					source={{ uri: `https://image.tmdb.org/t/p/w185${profilePath}` }}
					accessibilityLabel={lastActorName}
					style={styles.image}
				/>
			) : null}
			<View style={styles.messageBox}>
				<Text style={styles.trophy} accessibilityRole="image">
					🏆
				</Text>
				<Text style={styles.congrats}>Congratulations!</Text>
				<Text style={styles.text}>
					{lastActorName} played {character} in{" "}
					<Text style={styles.bold}>{movie.title}</Text>.
				</Text>
				<Text style={styles.text}>
					You have linked {firstActorName} to {lastActorName} with{" "}
					<Text style={styles.bold}>{degrees} degrees</Text> of separation!
				</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
		justifyContent: "center",
		padding: 24,
	},
	image: {
		borderRadius: 8,
		width: 120,
		height: 180,
		marginBottom: 16,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.15,
		shadowRadius: 12,
		elevation: 4,
		backgroundColor: "#eee",
	},
	messageBox: {
		alignItems: "center",
	},
	trophy: {
		fontSize: 32,
		marginBottom: 4,
	},
	congrats: {
		fontSize: 20,
		fontWeight: "bold",
		marginBottom: 8,
		color: "#3730a3",
	},
	text: {
		fontSize: 16,
		color: "#22223b",
		textAlign: "center",
		marginBottom: 4,
	},
	bold: {
		fontWeight: "bold",
		color: "#6366f1",
	},
});
