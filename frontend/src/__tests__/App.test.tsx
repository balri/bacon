import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, expect, it, vi } from "vitest";

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
