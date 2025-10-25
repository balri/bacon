import { useState } from "react";
import Loading from "./Loading";

interface ImageProps {
	url: string;
	alt: string;
	className?: string;
	isThumbnail?: boolean;
}

export default function Image({
	url,
	alt,
	className,
	isThumbnail = false,
}: ImageProps) {
	const [imgLoaded, setImgLoaded] = useState(false);

	return (
		<div className={`image-wrapper${className ? " " + className : ""}`}>
			<img
				src={url}
				alt={alt}
				className={`image-img${imgLoaded ? " loaded" : ""}`}
				onLoad={() => setImgLoaded(true)}
				loading="lazy"
			/>
			{!imgLoaded && (
				<div className="image-loading-overlay">
					<Loading small={!isThumbnail} tiny={isThumbnail} />
				</div>
			)}
		</div>
	);
}
