import { actorCredits } from "../../../server/actorCredits";
import { createGetHandler, getNumericParam } from "../../../server/http";

export default createGetHandler(async (request, response) => {
	const movieId = getNumericParam(request, response, "movieId");
	if (movieId === null) {
		return;
	}
	response.status(200).json(await actorCredits(movieId));
});
