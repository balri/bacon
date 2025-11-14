import { View, Text, FlatList, StyleSheet } from "react-native";
import type { Actor } from "../../lib/api";
import ActorListItem from "./ActorListItem";

interface ActorListProps {
	actors: Actor[];
	onActorClick: (actor: Actor) => void;
}

export default function ActorList({ actors, onActorClick }: ActorListProps) {
	if (!actors || actors.length === 0) {
		return (
			<View style={styles.errorContainer}>
				<Text style={styles.errorText}>❌ No cast found for this movie.</Text>
			</View>
		);
	}

	return (
		<FlatList
			data={actors}
			keyExtractor={(item) => item.id.toString()}
			renderItem={({ item }) => (
				<ActorListItem actor={item} onActorClick={onActorClick} />
			)}
			contentContainerStyle={styles.list}
		/>
	);
}

const styles = StyleSheet.create({
	list: {
		paddingVertical: 8,
	},
	errorContainer: {
		alignItems: "center",
		padding: 16,
	},
	errorText: {
		color: "#b91c1c",
		fontSize: 16,
	},
});
