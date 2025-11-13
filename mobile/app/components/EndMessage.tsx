import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

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
		<View style={styles.container}>
			<Text style={styles.title}>🎬 Mmmm, Bacon 🥓</Text>
			<View style={styles.topBar}>
				<Pressable style={styles.playAgainBtn} onPress={loadActor}>
					<Text style={styles.playAgainText}>🔀 Play Again</Text>
				</Pressable>
				{showBackButton && (
					<Pressable style={styles.backBtn} onPress={handleBack}>
						<Text style={styles.backText}>← Back</Text>
					</Pressable>
				)}
			</View>
			{breadcrumbs}
			<View style={styles.endOverlay}>
				<View style={styles.endMessage}>
					{typeof endMessage === "string" ? (
						<Text style={styles.endMessageText}>{endMessage}</Text>
					) : (
						endMessage
					)}
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 24,
		backgroundColor: "#fff",
		justifyContent: "flex-start",
	},
	title: {
		fontSize: 28,
		fontWeight: "bold",
		textAlign: "center",
		marginBottom: 16,
		color: "#3730a3",
	},
	topBar: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 12,
	},
	playAgainBtn: {
		backgroundColor: "#6366f1",
		paddingVertical: 8,
		paddingHorizontal: 16,
		borderRadius: 8,
		marginRight: 8,
	},
	playAgainText: {
		color: "#fff",
		fontWeight: "600",
		fontSize: 16,
	},
	backBtn: {
		backgroundColor: "#e0e7ff",
		paddingVertical: 8,
		paddingHorizontal: 16,
		borderRadius: 8,
	},
	backText: {
		color: "#3730a3",
		fontWeight: "600",
		fontSize: 16,
	},
	endOverlay: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	endMessage: {
		backgroundColor: "#f1f5f9",
		padding: 24,
		borderRadius: 12,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 2,
	},
	endMessageText: {
		fontSize: 18,
		color: "#3730a3",
		textAlign: "center",
	},
});
