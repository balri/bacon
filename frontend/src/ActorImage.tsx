import { useState } from "react";
import type { Actor } from "./api";
import Loading from "./Loading";

const actorContainerStyle = {
	minHeight: 130,
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
};

export default function ActorImage(actor: Actor) {
	const [imgLoaded, setImgLoaded] = useState(false);

	return (
		<div style={actorContainerStyle}>
			{!imgLoaded && <Loading small />}
			<img
				src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
				alt={actor.name}
				className="actor-image"
				style={{ display: imgLoaded ? "block" : "none" }}
				onLoad={() => setImgLoaded(true)}
			/>
		</div>
	);
}
