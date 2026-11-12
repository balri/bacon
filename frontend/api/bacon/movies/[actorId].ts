import { createGetHandler, getNumericParam } from "../../../server/http.js";
import { movieCredits } from "../../../server/movieCredits.js";

export default createGetHandler(async (request, response) => {
	const actorId = getNumericParam(request, response, "actorId");
	if (actorId === null) {
		return;
	}
	response.status(200).json(await movieCredits(actorId));
});
