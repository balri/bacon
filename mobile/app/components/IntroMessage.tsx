import { View, Text, Pressable } from "react-native";
import { introMessageStyles } from "../../lib/styles";

interface IntroMessageProps {
	onStart: () => void;
}

export default function IntroMessage({ onStart }: IntroMessageProps) {
	return (
		<View style={introMessageStyles.container}>
			<Text style={introMessageStyles.title}>🎬 Mmmm, Bacon 🥓</Text>
			<View style={introMessageStyles.overlay}>
				<View style={introMessageStyles.messageBox}>
					<Text style={introMessageStyles.heading}>
						Welcome to Six Degrees of Kevin Bacon!
					</Text>
					<Text style={introMessageStyles.paragraph}>
						Start with a random actor. Select a movie they've appeared in,
						then pick another actor from that movie, and so on.{"\n"}
						Your goal:{" "}
						<Text style={introMessageStyles.bold}>
							Reach Kevin Bacon in 6 steps or less!
						</Text>
					</Text>
					<Pressable style={introMessageStyles.button} onPress={onStart}>
						<Text style={introMessageStyles.buttonText}>Begin</Text>
					</Pressable>
				</View>
			</View>
		</View>
	);
}
