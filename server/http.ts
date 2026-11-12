import type { VercelRequest, VercelResponse } from "@vercel/node";

import { ExternalServiceError } from "./tmdb.js";

type Handler = (
	request: VercelRequest,
	response: VercelResponse,
) => Promise<void>;

export function createGetHandler(handler: Handler) {
	return async (request: VercelRequest, response: VercelResponse) => {
		if (request.method !== "GET") {
			response.setHeader("Allow", "GET");
			return response.status(405).json({ error: "Method not allowed." });
		}

		try {
			await handler(request, response);
		} catch (error) {
			console.error("Bacon API request failed:", error);
			const status = error instanceof ExternalServiceError ? 502 : 500;
			return response.status(status).json({
				error:
					status === 502
						? "An upstream service request failed."
						: "Internal server error.",
			});
		}
	};
}

export function getNumericParam(
	request: VercelRequest,
	response: VercelResponse,
	name: string,
): number | null {
	const value = request.query[name];
	if (typeof value !== "string" || !/^[1-9]\d*$/.test(value)) {
		response.status(400).json({ error: `Invalid ${name}.` });
		return null;
	}

	const id = Number(value);
	if (!Number.isSafeInteger(id)) {
		response.status(400).json({ error: `Invalid ${name}.` });
		return null;
	}
	return id;
}
