import { View, StyleSheet } from "react-native";
import type { Actor } from "../../lib/api";

import BaseImage from "./BaseImage";

interface ActorImageProps {
	actor: Actor;
}

export default function ActorImage({ actor }: ActorImageProps) {
	if (!actor.profile_path) {
		return null;
	}

	return (
		<View style={styles.container}>
			<BaseImage
				url={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
				alt={actor.name}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		minHeight: 130,
		alignItems: "center",
		justifyContent: "center",
	},
});
