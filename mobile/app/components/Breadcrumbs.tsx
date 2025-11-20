import { View, Text, StyleSheet, Pressable } from "react-native";
import type { Actor, Movie } from "../../lib/api";
import { breadcrumbsStyles } from "../../lib/styles";

interface BreadcrumbsProps {
	stack: Array<{ type: "actor" | "movie"; data: Actor | Movie }>;
	onPressItem?: (index: number) => void; // Optional: for navigation
}

export default function Breadcrumbs({ stack, onPressItem }: BreadcrumbsProps) {
	return (
		<View style={breadcrumbsStyles.container}>
			{stack.map((item, idx) => {
				const indent = idx * 6;
				const isActor = item.type === "actor";
				const label = isActor
					? (item.data as Actor).name
					: (item.data as Movie).title;

				const itemStyle = [
					breadcrumbsStyles.item,
					isActor ? breadcrumbsStyles.actor : breadcrumbsStyles.movie,
					{ marginLeft: indent, width: `100%` }, // width can be adjusted as needed
				];

				const isClickable = onPressItem && idx < stack.length - 1;

				const content = (
					<Text
						style={breadcrumbsStyles.text}
						numberOfLines={1}
						ellipsizeMode="tail"
					>
						{label}
					</Text>
				);

				return isClickable ? (
					<Pressable
						key={idx}
						style={breadcrumbsStyles.item}
						onPress={() => onPressItem(idx)}
					>
						{content}
					</Pressable>
				) : (
					<View key={idx} style={breadcrumbsStyles.item}>
						{content}
					</View>
				);
			})}
		</View>
	);
}
