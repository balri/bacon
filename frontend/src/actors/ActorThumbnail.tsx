import type { Actor } from "../api";
import Img from "../utils/Image";

export default function ActorThumbnail(actor: Actor) {
	return (
		<>
			<Img
				url={`https://image.tmdb.org/t/p/w45${actor.profile_path}`}
				alt={actor.name}
				className="actor-thumbnail"
			/>
		</>
	);
}
