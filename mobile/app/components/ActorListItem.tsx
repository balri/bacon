import { View, Text, Pressable, StyleSheet } from "react-native";
import type { Actor } from "../../lib/api";
import ActorThumbnail from "./ActorThumbnail";

interface ActorListItemProps {
	actor: Actor;
	onActorClick: (actor: Actor) => void;
}

export default function ActorListItem({
	actor,
	onActorClick,
}: ActorListItemProps) {
	return (
		<Pressable
			style={styles.item}
			onPress={() => onActorClick(actor)}
		>
			{actor.profile_path && <ActorThumbnail actor={actor} />}
			<View style={styles.textContainer}>
				<Text style={styles.name}>{actor.name}</Text>
				{actor.character && (
					<Text style={styles.character}>as {actor.character}</Text>
				)}
			</View>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	item: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 10,
		paddingHorizontal: 16,
		borderBottomWidth: 1,
		borderBottomColor: "#e5e7eb",
		backgroundColor: "#fff",
	},
	textContainer: {
		marginLeft: 12,
	},
	name: {
		fontSize: 16,
		fontWeight: "600",
		color: "#3730a3",
	},
	character: {
		fontSize: 14,
		color: "#6366f1",
		fontStyle: "italic",
	},
});
