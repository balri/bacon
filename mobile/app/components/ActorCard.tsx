import { View, Text, StyleSheet } from "react-native";
import type { Actor } from "../../lib/api";
import { actorCardStyles } from "../../lib/styles";

import ActorImage from "./ActorImage";

interface ActorCardProps {
	actor: Actor;
}

export default function ActorCard({ actor }: ActorCardProps) {
	return (
		<View style={actorCardStyles.card}>
			{actor.profile_path && <ActorImage actor={actor} />}
			<Text style={actorCardStyles.name}>{actor.name}</Text>
		</View>
	);
}
