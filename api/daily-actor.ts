import { createGetHandler } from "../server/http.js";
import {
	getBrisbaneDate,
	getDailyActorFromSheet,
} from "../server/dailyActor.js";

export default createGetHandler(async (_request, response) => {
	const actor = await getDailyActorFromSheet(getBrisbaneDate());
	if (!actor) {
		response
			.status(404)
			.json({ error: "No actor found for today's date." });
		return;
	}
	response.status(200).json(actor);
});
