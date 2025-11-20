import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { endMessageStyles } from "../../lib/styles";

interface EndMessageProps {
	endMessage: string | React.ReactNode;
	loadActor: () => void;
	handleBack: () => void;
	breadcrumbs: React.ReactNode;
	showBackButton?: boolean;
}

export default function EndMessage({
	endMessage,
	loadActor,
	handleBack,
	breadcrumbs,
	showBackButton,
}: EndMessageProps) {
	return (
		<View style={endMessageStyles.container}>
			<Text style={endMessageStyles.title}>🎬 Mmmm, Bacon 🥓</Text>
			<View style={endMessageStyles.topBar}>
				<Pressable style={endMessageStyles.playAgainBtn} onPress={loadActor}>
					<Text style={endMessageStyles.playAgainText}>🔀 Play Again</Text>
				</Pressable>
				{showBackButton && (
					<Pressable style={endMessageStyles.backBtn} onPress={handleBack}>
						<Text style={endMessageStyles.backText}>← Back</Text>
					</Pressable>
				)}
			</View>
			{breadcrumbs}
			<View style={endMessageStyles.endOverlay}>
				<View style={endMessageStyles.endMessage}>
					{typeof endMessage === "string" ? (
						<Text style={endMessageStyles.endMessageText}>{endMessage}</Text>
					) : (
						endMessage
					)}
				</View>
			</View>
		</View>
	);
}
