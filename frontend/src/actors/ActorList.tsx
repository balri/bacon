import type { Actor, Movie } from "../utils/types";

import ActorListItem from "./ActorListItem";

interface ActorListProps {
	actors: Actor[];
	onActorClick: (actor: Actor) => void;
	stack: Array<{ type: "actor" | "movie"; data: Actor | Movie }>;
}
export default function ActorList({
	actors,
	onActorClick,
	stack,
}: ActorListProps) {
	const actorIdsInStack = stack
		.filter((item) => item.type === "actor")
		.map((item) => (item.data as Actor).id);

	return (
		<ul className="actor-list">
			{actors && actors.length > 0 ? (
				actors.map((actor: Actor) => (
					<ActorListItem
						key={actor.id}
						actor={actor}
						onActorClick={onActorClick}
						alreadySelected={actorIdsInStack.includes(actor.id)}
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
