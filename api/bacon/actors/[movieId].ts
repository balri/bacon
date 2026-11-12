import { actorCredits } from "../../../server/actorCredits.js";
import { createGetHandler, getNumericParam } from "../../../server/http.js";

export default createGetHandler(async (request, response) => {
	const movieId = getNumericParam(request, response, "movieId");
	if (movieId === null) {
		return;
	}
	response.status(200).json(await actorCredits(movieId));
});
