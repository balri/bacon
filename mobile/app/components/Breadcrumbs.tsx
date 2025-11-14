import { View, Text, StyleSheet, Pressable } from "react-native";
import type { Actor, Movie } from "../../lib/api";

interface BreadcrumbsProps {
	stack: Array<{ type: "actor" | "movie"; data: Actor | Movie }>;
	onPressItem?: (index: number) => void; // Optional: for navigation
}

export default function Breadcrumbs({ stack, onPressItem }: BreadcrumbsProps) {
	return (
		<View style={styles.container}>
			{stack.map((item, idx) => {
				const indent = idx * 6;
				const isActor = item.type === "actor";
				const label = isActor
					? (item.data as Actor).name
					: (item.data as Movie).title;

				const itemStyle = [
					styles.item,
					isActor ? styles.actor : styles.movie,
					{ marginLeft: indent, width: `100%` }, // width can be adjusted as needed
				];

				const isClickable = onPressItem && idx < stack.length - 1;

				const content = (
					<Text
						style={styles.text}
						numberOfLines={1}
						ellipsizeMode="tail"
					>
						{label}
					</Text>
				);

				return isClickable ? (
					<Pressable
						key={idx}
						style={styles.item}
						onPress={() => onPressItem(idx)}
					>
						{content}
					</Pressable>
				) : (
					<View key={idx} style={styles.item}>
						{content}
					</View>
				);
			})}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "column",
		paddingVertical: 8,
	},
	item: {
		paddingVertical: 4,
		paddingHorizontal: 8,
		borderRadius: 6,
		marginBottom: 2,
	},
	actor: {
		backgroundColor: "#eef2ff",
	},
	movie: {
		backgroundColor: "#f1f5f9",
	},
	text: {
		fontSize: 15,
		color: "#3730a3",
	},
});
