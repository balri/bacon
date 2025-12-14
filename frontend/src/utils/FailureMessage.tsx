import type { Actor } from "../api";
import { SIX_DEGREES } from "../App";

interface FailureMessageProps {
	firstActor: Actor | null;
}

export default function FailureMessage({ firstActor }: FailureMessageProps) {
	const firstActorName = firstActor?.name || "Unknown Actor";

	return (
		<div>
			<span role="img" aria-label="sad">
				😢
			</span>
			You have failed to link {firstActorName} to Kevin Bacon with{" "}
			{SIX_DEGREES} degrees of separation!
			<br />
			Go back or start again.
		</div>
	);
}
