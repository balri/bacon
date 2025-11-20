import { useState } from "react";
import { View, Image, ActivityIndicator } from "react-native";
import { baseImageStyles } from "../../lib/styles";

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
		<View style={baseImageStyles.wrapper}>
			<Image
				source={{ uri: url }}
				accessibilityLabel={alt}
				style={[
					baseImageStyles.img,
					imgLoaded && baseImageStyles.loaded,
					isThumbnail && baseImageStyles.thumbnail,
				]}
				onLoad={() => setImgLoaded(true)}
			/>
			{
				!imgLoaded && (
					<View style={baseImageStyles.loadingOverlay}>
						<ActivityIndicator
							size={isThumbnail ? "small" : "large"}
							color="#6366f1"
						/>
					</View>
				)
			}
		</View >
	);
}
