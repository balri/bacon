import type { Actor } from "../api";

import ActorThumbnail from "./ActorThumbnail";

interface ActorListItemProps {
	actor: Actor;
	onActorClick: (actor: Actor) => void;
	alreadySelected?: boolean;
}

export default function ActorListItem({
	actor,
	onActorClick,
	alreadySelected = false,
}: ActorListItemProps) {
	return (
		<li
			key={actor.id}
			className={alreadySelected ? "actor-item selected" : "actor-item"}
			style={
				alreadySelected
					? {
							cursor: "not-allowed",
							opacity: 0.5,
							pointerEvents: "none",
						}
					: { cursor: "pointer" }
			}
			onClick={alreadySelected ? undefined : () => onActorClick(actor)}
		>
			{actor.profile_path && <ActorThumbnail {...actor} />}
			<span className="actor-meta">
				<span className="actor-item-name">{actor.name}</span>
				{actor.character && (
					<span className="actor-character">
						as {actor.character}
					</span>
				)}
			</span>
		</li>
	);
}
