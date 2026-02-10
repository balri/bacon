import type { Actor } from "../utils/types";

import ActorListItem from "./ActorListItem";

interface ActorListProps {
	actors: Actor[];
	onActorClick: (actor: Actor) => void;
	alreadySelected: boolean;
}
export default function ActorList({
	actors,
	onActorClick,
	alreadySelected,
}: ActorListProps) {
	return (
		<ul className="actor-list">
			{actors && actors.length > 0 ? (
				actors.map((actor: Actor) => (
					<ActorListItem
						key={actor.id}
						actor={actor}
						onActorClick={onActorClick}
						alreadySelected={alreadySelected}
					/>
				))
			) : (
				<li className="error-message">
					❌ No cast found for this movie.
				</li>
			)}
		</ul>
	);
}
