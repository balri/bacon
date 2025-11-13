import { useState } from "react";
import { View, Image, StyleSheet, ActivityIndicator } from "react-native";

interface BaseImageProps {
	url: string;
	alt: string;
	isThumbnail?: boolean;
}

export default function BaseImage({
	url,
	alt,
	isThumbnail = false,
}: BaseImageProps) {
	const [imgLoaded, setImgLoaded] = useState(false);

	return (
		<View style={styles.wrapper}>
			<Image
				source={{ uri: url }}
				accessibilityLabel={alt}
				style={[
					styles.img,
					imgLoaded && styles.loaded,
					isThumbnail && styles.thumbnail,
				]}
				onLoad={() => setImgLoaded(true)}
			/>
			{!imgLoaded && (
				<View style={styles.loadingOverlay}>
					<ActivityIndicator
						size={isThumbnail ? "small" : "large"}
						color="#6366f1"
					/>
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	wrapper: {
		justifyContent: "center",
		alignItems: "center",
		position: "relative",
	},
	img: {
		width: 120,
		height: 120,
		borderRadius: 8,
		backgroundColor: "#eee",
	},
	loaded: {
		opacity: 1,
	},
	thumbnail: {
		width: 60,
		height: 60,
	},
	loadingOverlay: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(255,255,255,0.5)",
		borderRadius: 8,
	},
});
