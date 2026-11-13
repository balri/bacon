import { TMDB_BASE_URL } from "./types.js";

export class ExternalServiceError extends Error {
	readonly status?: number;

	constructor(service: string, message: string, status?: number) {
		super(`${service}: ${message}`);
		this.name = "ExternalServiceError";
		this.status = status;
	}
}

export class OperationTimeoutError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "OperationTimeoutError";
	}
}

export async function fetchTmdb<T>(
	path: string,
	timeoutMs?: number,
): Promise<T> {
	const apiKey = process.env["TMDB_API_KEY"];
	if (!apiKey) {
		throw new Error("TMDB_API_KEY is not configured.");
	}

	const url = new URL(`${TMDB_BASE_URL}${path}`);
	url.searchParams.set("api_key", apiKey);

	let response: Response;
	try {
		response = await fetch(
			url,
			timeoutMs === undefined
				? undefined
				: { signal: AbortSignal.timeout(timeoutMs) },
		);
	} catch (error) {
		if (error instanceof Error && error.name === "TimeoutError") {
			throw new OperationTimeoutError("TMDB request timed out.");
		}
		throw new ExternalServiceError(
			"TMDB",
			error instanceof Error ? error.message : "Network request failed.",
		);
	}

	if (!response.ok) {
		throw new ExternalServiceError(
			"TMDB",
			`Request failed with status ${response.status}.`,
			response.status,
		);
	}

	try {
		return (await response.json()) as T;
	} catch (error) {
		throw new ExternalServiceError(
			"TMDB",
			error instanceof Error ? error.message : "Invalid JSON response.",
		);
	}
}
