import type { Actor } from "../api";
import ActorListItem from "./ActorListItem";

interface ActorListProps {
	actors: Actor[];
	onActorClick: (actor: Actor) => void;
}
export default function ActorList({ actors, onActorClick }: ActorListProps) {
	return (
		<ul className="actor-list">
			{actors && actors.length > 0 ? actors.map((actor: Actor) => (
				<ActorListItem actor={actor} onActorClick={onActorClick} />
			)) : (
				<li className="error-message">
					❌ No cast found for this movie.
				</li>
			)}
		</ul>
	);
}
