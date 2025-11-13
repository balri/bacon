import { View, Text, Pressable, StyleSheet } from "react-native";

interface IntroMessageProps {
	onStart: () => void;
}

export default function IntroMessage({ onStart }: IntroMessageProps) {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>🎬 Mmmm, Bacon 🥓</Text>
			<View style={styles.overlay}>
				<View style={styles.messageBox}>
					<Text style={styles.heading}>
						Welcome to Six Degrees of Kevin Bacon!
					</Text>
					<Text style={styles.paragraph}>
						Start with a random actor. Select a movie they've appeared in,
						then pick another actor from that movie, and so on.{"\n"}
						Your goal:{" "}
						<Text style={styles.bold}>
							Reach Kevin Bacon in 6 steps or less!
						</Text>
					</Text>
					<Pressable style={styles.button} onPress={onStart}>
						<Text style={styles.buttonText}>Begin</Text>
					</Pressable>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#fff",
		padding: 24,
	},
	title: {
		fontSize: 32,
		fontWeight: "bold",
		textAlign: "center",
		color: "#3730a3",
		marginBottom: 24,
	},
	overlay: {
		width: "100%",
		alignItems: "center",
	},
	messageBox: {
		backgroundColor: "#eef2ff",
		borderRadius: 12,
		padding: 24,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.08,
		shadowRadius: 8,
		elevation: 2,
	},
	heading: {
		fontSize: 22,
		fontWeight: "bold",
		marginBottom: 12,
		color: "#3730a3",
		textAlign: "center",
	},
	paragraph: {
		fontSize: 16,
		color: "#22223b",
		marginBottom: 20,
		textAlign: "center",
	},
	bold: {
		fontWeight: "bold",
		color: "#6366f1",
	},
	button: {
		backgroundColor: "#6366f1",
		paddingVertical: 12,
		paddingHorizontal: 32,
		borderRadius: 8,
	},
	buttonText: {
		color: "#fff",
		fontSize: 18,
		fontWeight: "600",
	},
});
