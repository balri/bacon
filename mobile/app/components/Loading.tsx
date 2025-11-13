import { View, Text, ActivityIndicator, StyleSheet } from "react-native";

interface LoadingProps {
	small?: boolean;
	tiny?: boolean;
}

export default function Loading({ small, tiny }: LoadingProps) {
	let containerStyle = styles.container;
	let spinnerSize: "small" | "large" = "large";
	let textStyle = styles.text;
	let text = "Loading...";

	if (tiny) {
		containerStyle = styles.tinyContainer;
		spinnerSize = "small";
		textStyle = styles.tinyText;
		text = "";
	} else if (small) {
		containerStyle = styles.smallContainer;
		spinnerSize = "small";
		textStyle = styles.smallText;
	}

	return (
		<View style={containerStyle}>
			<ActivityIndicator size={spinnerSize} color="#6366f1" />
			{text ? <Text style={textStyle}>{text}</Text> : null}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
		justifyContent: "center",
		padding: 24,
	},
	smallContainer: {
		alignItems: "center",
		justifyContent: "center",
		padding: 12,
	},
	tinyContainer: {
		alignItems: "center",
		justifyContent: "center",
		padding: 4,
	},
	text: {
		marginTop: 12,
		fontSize: 18,
		color: "#6366f1",
	},
	smallText: {
		marginTop: 8,
		fontSize: 14,
		color: "#6366f1",
	},
	tinyText: {
		marginTop: 0,
		fontSize: 0,
		color: "#6366f1",
	},
});
