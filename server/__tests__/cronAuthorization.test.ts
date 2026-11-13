import type { VercelRequest, VercelResponse } from "@vercel/node";
import { afterEach, describe, expect, it, vi } from "vitest";

import { requireCronAuthorization } from "../http.js";

function createResponse() {
	return {
		status: vi.fn().mockReturnThis(),
		json: vi.fn().mockReturnThis(),
	} as unknown as VercelResponse;
}

describe("requireCronAuthorization", () => {
	afterEach(() => {
		delete process.env["CRON_SECRET"];
	});

	it("rejects requests when the secret is not configured", () => {
		const response = createResponse();

		const authorized = requireCronAuthorization(
			{ headers: {} } as VercelRequest,
			response,
		);

		expect(authorized).toBe(false);
		expect(response.status).toHaveBeenCalledWith(500);
	});

	it("rejects a missing or incorrect bearer token", () => {
		process.env["CRON_SECRET"] = "test-secret";
		const response = createResponse();

		const authorized = requireCronAuthorization(
			{
				headers: { authorization: "Bearer wrong-secret" },
			} as VercelRequest,
			response,
		);

		expect(authorized).toBe(false);
		expect(response.status).toHaveBeenCalledWith(401);
	});

	it("accepts the configured bearer token", () => {
		process.env["CRON_SECRET"] = "test-secret";
		const response = createResponse();

		const authorized = requireCronAuthorization(
			{
				headers: { authorization: "Bearer test-secret" },
			} as VercelRequest,
			response,
		);

		expect(authorized).toBe(true);
		expect(response.status).not.toHaveBeenCalled();
	});
});
