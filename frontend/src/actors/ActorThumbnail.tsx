import Image from "../utils/Image";
import type { Actor } from "../utils/types";

export default function ActorThumbnail(actor: Actor) {
	return (
		<>
			<Image
				url={`https://image.tmdb.org/t/p/w45${actor.profile_path}`}
				alt={actor.name}
				className="actor-thumbnail"
				isThumbnail={true}
			/>
		</>
	);
}
