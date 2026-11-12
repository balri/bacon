import { getActor } from "../../../server/actorCredits";
import { createGetHandler, getNumericParam } from "../../../server/http";
import { movieCredits } from "../../../server/movieCredits";

export default createGetHandler(async (request, response) => {
	const actorId = getNumericParam(request, response, "actorId");
	if (actorId === null) {
		return;
	}
	const actor = await getActor(actorId);
	if (!actor) {
		response.status(404).json({ error: "Actor not found." });
		return;
	}
	response.status(200).json({
		...actor,
		movies: await movieCredits(actorId, false),
	});
});
