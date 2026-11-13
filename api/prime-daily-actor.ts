import { createGetHandler, requireCronAuthorization } from "../server/http.js";
import { primeDailyActor } from "../server/primeDailyActor.js";

export const config = {
	maxDuration: 60,
};

export default createGetHandler(async (request, response) => {
	if (!requireCronAuthorization(request, response)) {
		return;
	}

	const result = await primeDailyActor();
	response.status(result.status).json(result.body);
});
