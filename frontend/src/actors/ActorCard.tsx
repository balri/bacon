import type { Actor } from "../api";
import ActorImage from "./ActorImage";

interface ActorCardProps {
	actor: Actor;
}

export default function ActorCard({ actor }: ActorCardProps) {
	return (
		<div className="actor-card">
			{actor.profile_path && (
				<ActorImage {...actor} />
			)}
			<h2 className="actor-name">{actor.name}</h2>
		</div>
	);
}
