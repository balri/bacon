import type { Actor } from "../api";
import ActorThumbnail from "./ActorThumbnail";

interface ActorListItemProps {
	actor: Actor;
	onActorClick: (actor: Actor) => void;
}

export default function ActorListItem({ actor, onActorClick }: ActorListItemProps) {
	return (
		<li
			key={actor.id}
			className="actor-item"
			style={{ cursor: "pointer" }}
			onClick={() => onActorClick(actor)}
		>
			{actor.profile_path && (
				<ActorThumbnail {...actor} />
			)}
			<span className="actor-item-name">{actor.name}</span>
			{actor.character && (
				<span className="actor-character">
					as {actor.character}
				</span>
			)}
		</li>
	);
}
