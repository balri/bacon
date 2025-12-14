import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect, vi } from "vitest";

import MovieView from "../MovieView";
import * as api from "../../api";
import { KEVIN_BACON_ID } from "../../App";
import type { Actor, Movie } from "../../api";

vi.mock("../../api", async () => {
	const actual = await vi.importActual<object>("../../api");
	return {
		...actual,
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
	};
});

describe("MovieView", () => {
	it("renders movie title", async () => {
		const onClick = vi.fn();
		render(
			<MovieView
				movie={{
					id: 1,
					title: "Forrest Gump",
				}}
				stack={[]}
				onActorClick={onClick}
			/>,
		);
		expect(await screen.findByText("Forrest Gump")).toBeInTheDocument();
	});

	it("lists actors if returned", async () => {
		const onClick = vi.fn();
		render(
			<MovieView
				movie={{
					id: 1,
					title: "Forrest Gump",
				}}
				stack={[]}
				onActorClick={onClick}
			/>,
		);
		expect(await screen.findByText("Tom Hanks")).toBeInTheDocument();
		expect(await screen.findByText("Robin Wright")).toBeInTheDocument();
	});

	it("shows an error if no actors are returned", async () => {
		vi.spyOn(api, "getActorsForMovie").mockResolvedValueOnce([]);
		const onClick = vi.fn();
		render(
			<MovieView
				movie={{
					id: 1,
					title: "Forrest Gump",
				}}
				stack={[]}
				onActorClick={onClick}
			/>,
		);
		expect(
			await screen.findByText("❌ No cast found for this movie."),
		).toBeInTheDocument();
	});

	it("does not list actors already in the stack", async () => {
		const onClick = vi.fn();
		render(
			<MovieView
				movie={{
					id: 1,
					title: "Forrest Gump",
				}}
				stack={[{ type: "actor", data: { id: 1, name: "Tom Hanks" } }]}
				onActorClick={onClick}
			/>,
		);
		expect(await screen.findByText("Robin Wright")).toBeInTheDocument();
		expect(screen.queryByText("Tom Hanks")).not.toBeInTheDocument();
	});

	it("calls onGameEnd with success if Kevin Bacon is found", async () => {
		const onGameEnd = vi.fn();
		vi.spyOn(api, "getActorsForMovie").mockResolvedValueOnce([
			{
				id: KEVIN_BACON_ID,
				name: "Kevin Bacon",
				profile_path: "",
				character: "Himself",
			},
		]);
		render(
			<MovieView
				movie={{ id: 1, title: "A Movie" }}
				stack={[]}
				onActorClick={() => { }}
			/>,
		);
		await waitFor(() =>
			expect(onGameEnd).toHaveBeenCalledWith(
				expect.objectContaining({ type: "success" }),
			),
		);
	});

	it("calls onGameEnd with failure if 6 actors in stack and Kevin Bacon is not found", async () => {
		const onGameEnd = vi.fn();
		vi.spyOn(api, "getActorsForMovie").mockResolvedValueOnce([
			{ id: 1, name: "Tom Hanks", profile_path: "", character: "A" },
			{ id: 2, name: "Robin Wright", profile_path: "", character: "B" },
		]);
		const stack: Array<{ type: "actor" | "movie"; data: Actor | Movie }> = [
			{ type: "actor", data: { id: 10, name: "A" } },
			{ type: "movie", data: { id: 11, title: "M1" } },
			{ type: "actor", data: { id: 12, name: "B" } },
			{ type: "movie", data: { id: 13, title: "M2" } },
			{ type: "actor", data: { id: 14, name: "C" } },
			{ type: "movie", data: { id: 15, title: "M3" } },
			{ type: "actor", data: { id: 16, name: "D" } },
			{ type: "movie", data: { id: 17, title: "M4" } },
			{ type: "actor", data: { id: 18, name: "E" } },
			{ type: "movie", data: { id: 19, title: "M5" } },
			{ type: "actor", data: { id: 20, name: "F" } },
		];
		render(
			<MovieView
				movie={{ id: 1, title: "A Movie" }}
				stack={stack}
				onActorClick={() => { }}
			/>,
		);
		await waitFor(() =>
			expect(onGameEnd).toHaveBeenCalledWith(
				expect.objectContaining({ type: "failure" }),
			),
		);
	});

	it("calls onActorClick when an actor is clicked", async () => {
		const onActorClick = vi.fn();
		render(
			<MovieView
				movie={{
					id: 1,
					title: "Forrest Gump",
				}}
				stack={[]}
				onActorClick={onActorClick}
			/>,
		);
		const actor = await screen.findByText("Tom Hanks");
		actor.click();
		expect(onActorClick).toHaveBeenCalledWith(
			expect.objectContaining({ id: 1, name: "Tom Hanks" }),
		);
	});
});
