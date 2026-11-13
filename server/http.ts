import { Buffer } from "node:buffer";
import { timingSafeEqual } from "node:crypto";

import type { VercelRequest, VercelResponse } from "@vercel/node";

import { ExternalServiceError, OperationTimeoutError } from "./tmdb.js";

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
			const status =
				error instanceof OperationTimeoutError
					? 504
					: error instanceof ExternalServiceError
						? 502
						: 500;
			return response.status(status).json({
				error:
					status === 504
						? "The request exceeded its time limit."
						: status === 502
							? "An upstream service request failed."
							: "Internal server error.",
			});
		}
	};
}

export function requireCronAuthorization(
	request: VercelRequest,
	response: VercelResponse,
): boolean {
	const secret = process.env["CRON_SECRET"];
	if (!secret) {
		response
			.status(500)
			.json({ error: "Cron authorization is not configured." });
		return false;
	}

	const authorization = request.headers.authorization;
	const token =
		typeof authorization === "string" && /^Bearer \S+$/.test(authorization)
			? authorization.slice("Bearer ".length)
			: "";
	const supplied = Buffer.from(token);
	const expected = Buffer.from(secret);
	if (
		supplied.length !== expected.length ||
		!timingSafeEqual(supplied, expected)
	) {
		response.status(401).json({ error: "Unauthorized." });
		return false;
	}
	return true;
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
