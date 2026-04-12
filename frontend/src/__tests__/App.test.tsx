import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

import App from "../App";

vi.mock("../api", async () => {
	const actual = await vi.importActual<object>("../api");
	return {
		...actual,
		getDailyActor: vi.fn().mockResolvedValue({
			id: 1,
			name: "Tom Hanks",
			profile_path: "",
			character: "Forrest Gump",
		}),
		getActorsForMovie: vi.fn().mockResolvedValue([
			{
				id: 1,
				name: "Tom Hanks",
				profile_path: "",
				character: "Forrest Gump",
			},
			{
				id: 2,
				name: "Robin Wright",
				profile_path: "",
				character: "Jenny Curran",
			},
		]),
		getMoviesForActor: vi.fn().mockResolvedValue([
			{
				id: 1,
				title: "Big",
				poster_path: "",
				release_date: "1988-06-03",
			},
			{
				id: 2,
				title: "Forrest Gump",
				poster_path: "",
				release_date: "1994-07-06",
			},
		]),
	};
});

describe("App", () => {
	afterEach(() => vi.restoreAllMocks());

	it("shows intro and begins game on begin", async () => {
		render(<App />);
		expect(screen.getByText("🎬 Mmmm, Bacon 🥓")).toBeInTheDocument();
		fireEvent.click(screen.getByText(/begin/i));
		await waitFor(() =>
			expect(screen.getByText("Tom Hanks")).toBeInTheDocument(),
		);
	});

	it("shows loading spinner when loading", async () => {
		render(<App />);
		fireEvent.click(screen.getByText(/begin/i));
		expect(screen.getByText(/loading/i)).toBeInTheDocument();
		await waitFor(() => screen.getByText("Tom Hanks"));
	});

	it("can go from actor to movie to actor", async () => {
		render(<App />);
		fireEvent.click(screen.getByText(/begin/i));
		await screen.findByText("Forrest Gump");
		fireEvent.click(screen.getByText("Forrest Gump"));
		await screen.findByText("Robin Wright");
		fireEvent.click(screen.getByText("Robin Wright"));
		await screen.findByText("Big");
	});

	it("shows failure message for returning user who has not completed today's puzzle", async () => {
		const cookie = await import("../utils/cookie");
		vi.spyOn(cookie, "getAllCookieData").mockReturnValue({
			"2026-04-11": { actorId: 1, completed: false, stack: [] },
		});
		vi.spyOn(cookie, "getCookieData").mockReturnValue({
			actorId: 1,
			completed: false,
			stack: [],
		});
		vi.spyOn(cookie, "getTodayDateString").mockReturnValue("2026-04-11");

		render(<App />);
		await screen.findByText(/No Connection Found/i);
	});

	it("saves stack to cookie when Kevin Bacon is reached", async () => {
		const cookie = await import("../utils/cookie");
		const setCookieDataSpy = vi
			.spyOn(cookie, "setCookieData")
			.mockReturnValue({
				completed: true,
				actorId: 1,
				degrees: 1,
				numSolved: 1,
				longestStreak: 1,
				streak: 1,
				stack: [],
			});

		const api = await import("../api");
		vi.spyOn(api, "getActorsForMovie").mockResolvedValueOnce([
			{
				id: 4724,
				name: "Kevin Bacon",
				profile_path: "",
				character: "Himself",
			},
		]);

		render(<App />);
		fireEvent.click(screen.getByText(/begin/i));
		await screen.findByText("Big");
		fireEvent.click(screen.getByText("Big"));
		await screen.findByText("Kevin Bacon");
		fireEvent.click(screen.getByText("Kevin Bacon"));
		await screen.findByText(/congratulations/i);

		expect(setCookieDataSpy).toHaveBeenCalledWith(
			expect.objectContaining({
				stack: [
					expect.objectContaining({
						type: "actor",
						data: expect.objectContaining({ id: 1 }),
					}),
					expect.objectContaining({
						type: "movie",
						data: expect.objectContaining({ id: 1 }),
					}),
					expect.objectContaining({
						type: "actor",
						data: expect.objectContaining({ id: 4724 }),
					}),
				],
			}),
		);
	});

	it("restores stack from cookie for a previously completed game", async () => {
		const cookie = await import("../utils/cookie");
		const savedStack = [
			{
				type: "actor" as const,
				data: {
					id: 1,
					name: "Tom Hanks",
					profile_path: "",
					character: "Forrest Gump",
				},
			},
			{
				type: "movie" as const,
				data: {
					id: 1,
					title: "Big",
					poster_path: "",
					release_date: "1988-06-03",
				},
			},
			{
				type: "actor" as const,
				data: {
					id: 4724,
					name: "Kevin Bacon",
					profile_path: "",
					character: "Himself",
				},
			},
		];

		vi.spyOn(cookie, "getAllCookieData").mockReturnValue({
			"2026-04-11": { actorId: 1, completed: true, stack: savedStack },
		});
		vi.spyOn(cookie, "getCookieData").mockReturnValue({
			actorId: 1,
			completed: true,
			degrees: 1,
			numSolved: 1,
			longestStreak: 1,
			streak: 1,
			stack: savedStack,
		});
		vi.spyOn(cookie, "getTodayDateString").mockReturnValue("2026-04-11");

		render(<App />);
		await screen.findByText(/congratulations/i);

		fireEvent.click(screen.getByText("Progress"));
		const breadcrumbList = screen.getByRole("list");
		expect(breadcrumbList).toHaveTextContent("Tom Hanks");
		expect(breadcrumbList).toHaveTextContent("Big");
		expect(breadcrumbList).toHaveTextContent("Kevin Bacon");
	});

	it("shows end message when a movie with Kevin Bacon is clicked", async () => {
		const api = await import("../api");
		vi.spyOn(api, "getActorsForMovie").mockResolvedValueOnce([
			{
				id: 4724,
				name: "Kevin Bacon",
				profile_path: "",
				character: "Himself",
			},
		]);

		render(<App />);
		fireEvent.click(screen.getByText(/begin/i));
		await screen.findByText("Forrest Gump");
		fireEvent.click(screen.getByText("Big"));
		await screen.findByText(/success|congratulations|kevin bacon/i);
	});
});
