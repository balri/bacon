import { useState } from "react";
import Loading from "./Loading";

interface ImageProps {
	url: string;
	alt: string;
	className?: string;
}

export default function Image({ url, alt, className }: ImageProps) {
	const [imgLoaded, setImgLoaded] = useState(false);

	return (
		<>
			{!imgLoaded && <Loading small />}
			<img
				src={url}
				alt={alt}
				className={className}
				style={{ display: imgLoaded ? "block" : "none" }}
				onLoad={() => setImgLoaded(true)}
			/>
		</>
	);
}
