import { View, Text, StyleSheet } from "react-native";
import type { Actor } from "../api";

import ActorImage from "./ActorImage";

interface ActorCardProps {
	actor: Actor;
}

export default function ActorCard({ actor }: ActorCardProps) {
	return (
		<View style={styles.card}>
			{actor.profile_path && <ActorImage actor={actor} />}
			<Text style={styles.name}>{actor.name}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	card: {
		alignItems: "center",
		backgroundColor: "#eef2ff",
		borderRadius: 12,
		shadowColor: "#3730a3",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.07,
		shadowRadius: 8,
		elevation: 2,
		marginBottom: 16,
		padding: 16,
	},
	name: {
		color: "#3730a3",
		fontSize: 22,
		fontWeight: "600",
		marginTop: 0,
		marginBottom: 0,
		textAlign: "center",
	},
});
