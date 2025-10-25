import type { Actor } from "../api";
import Image from "../utils/Image";

const actorContainerStyle = {
	minHeight: 130,
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
};

export default function ActorImage(actor: Actor) {
	return (
		<div style={actorContainerStyle}>
			<Image
				url={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
				alt={actor.name}
				className="actor-image"
			/>
		</div>
	);
}
