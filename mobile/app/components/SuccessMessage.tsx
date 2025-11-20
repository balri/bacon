import { View, Text, Image, StyleSheet } from "react-native";
import type { Actor } from "../../lib/api";
import { successMessageStyles } from "../../lib/styles";

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
		<View style={successMessageStyles.container}>
			{profilePath ? (
				<Image
					source={{ uri: `https://image.tmdb.org/t/p/w185${profilePath}` }}
					accessibilityLabel={lastActorName}
					style={successMessageStyles.image}
				/>
			) : null}
			<View style={successMessageStyles.messageBox}>
				<Text style={successMessageStyles.trophy} accessibilityRole="image">
					🏆
				</Text>
				<Text style={successMessageStyles.congrats}>Congratulations!</Text>
				<Text style={successMessageStyles.text}>
					{lastActorName} played {character} in{" "}
					<Text style={successMessageStyles.bold}>{movie.title}</Text>.
				</Text>
				<Text style={successMessageStyles.text}>
					You have linked {firstActorName} to {lastActorName} with{" "}
					<Text style={successMessageStyles.bold}>{degrees} degrees</Text> of
					separation!
				</Text>
			</View>
		</View>
	);
}
