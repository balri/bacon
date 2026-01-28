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
	const testId = alreadySelected ? "selected-actor-item" : "actor-item";
	return (
		<li
			key={actor.id}
			className={alreadySelected ? "selected-actor-item" : "actor-item"}
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
				<span className="actor-item-name" data-testid={testId}>
					{actor.name}
				</span>
				{actor.character && (
					<span className="actor-character">
						as {actor.character}
					</span>
				)}
			</span>
		</li>
	);
}
