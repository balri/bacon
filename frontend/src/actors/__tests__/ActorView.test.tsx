import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect, vi } from "vitest";

import * as api from "../../api";
import ActorView from "../ActorView";
import { KEVIN_BACON_ID } from "../../App";
import type { Actor, Movie } from "../../api";

vi.mock("../../api", async () => {
	const actual = await vi.importActual<object>("../../api");
	return {
		...actual,
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

describe("ActorView", () => {
	it("renders actor name", async () => {
		const onClick = vi.fn();
		render(
			<ActorView
				actor={{
					id: 1,
					name: "Tom Hanks",
					profile_path: "",
					character: "Forrest Gump",
				}}
				onMovieClick={onClick}
				stack={[]}
			/>,
		);
		expect(await screen.findByText("Tom Hanks")).toBeInTheDocument();
	});

	it("lists movies if returned", async () => {
		const onClick = vi.fn();
		render(
			<ActorView
				actor={{
					id: 1,
					name: "Tom Hanks",
					profile_path: "",
					character: "Forrest Gump",
				}}
				onMovieClick={onClick}
				stack={[]}
			/>,
		);
		expect(await screen.findByText("Big")).toBeInTheDocument();
		expect(await screen.findByText("Forrest Gump")).toBeInTheDocument();
	});

	it("shows an error message if no movies are returned", async () => {
		vi.spyOn(api, "getMoviesForActor").mockResolvedValueOnce([]);
		const onClick = vi.fn();
		render(
			<ActorView
				actor={{
					id: 1,
					name: "Tom Hanks",
					profile_path: "",
					character: "Forrest Gump",
				}}
				onMovieClick={onClick}
				stack={[]}
			/>,
		);
		expect(await screen.findByText(/no movies found/i)).toBeInTheDocument();
	});

	it("lists movies already in the stack", async () => {
		const onClick = vi.fn();
		render(
			<ActorView
				actor={{
					id: 1,
					name: "Tom Hanks",
					profile_path: "",
					character: "Forrest Gump",
				}}
				onMovieClick={onClick}
				stack={[
					{
						type: "movie",
						data: {
							id: 1,
							title: "Big",
							poster_path: "",
							release_date: "1988-06-03",
						},
					},
				]}
			/>,
		);
		expect(await screen.findByTestId("movie-item")).toHaveTextContent(
			"Forrest Gump",
		);
		expect(
			await screen.findByTestId("selected-movie-item"),
		).toHaveTextContent("Big");
	});

	it("calls onGameEnd with success if Kevin Bacon is found", async () => {
		const onGameEnd = vi.fn();
		const stack: Array<{ type: "actor" | "movie"; data: Actor | Movie }> = [
			{ type: "actor", data: { id: 26054, name: "Claudia Black" } },
			{ type: "movie", data: { id: 2787, title: "Pitch Black" } },
			{ type: "actor", data: { id: 12835, name: "Vin Diesel" } },
			{ type: "movie", data: { id: 857, title: "Saving Private Ryan" } },
			{ type: "actor", data: { id: 31, name: "Tom Hanks" } },
			{ type: "movie", data: { id: 568, title: "Apollo 13" } },
			{
				type: "actor",
				data: { id: KEVIN_BACON_ID, name: "Kevin Bacon" },
			},
		];
		render(
			<ActorView
				actor={{
					id: KEVIN_BACON_ID,
					name: "Kevin Bacon",
					profile_path: "/rjX2Oz3tCZMfSwOoIAyEhdtXnTE.jpg",
					character: "Himself",
				}}
				stack={stack}
				onMovieClick={() => {}}
				onGameEnd={onGameEnd}
			/>,
		);
		await waitFor(() => expect(onGameEnd).toHaveBeenCalledWith("success"));
	});

	it("calls onGameEnd with failure if 6 actors in stack and Kevin Bacon is not found", async () => {
		const onGameEnd = vi.fn();
		const stack: Array<{ type: "actor" | "movie"; data: Actor | Movie }> = [
			{ type: "actor", data: { id: 26054, name: "Claudia Black" } },
			{ type: "movie", data: { id: 2787, title: "Pitch Black" } },
			{ type: "actor", data: { id: 12835, name: "Vin Diesel" } },
			{ type: "movie", data: { id: 857, title: "Saving Private Ryan" } },
			{ type: "actor", data: { id: 31, name: "Tom Hanks" } },
			{ type: "movie", data: { id: 13, title: "Forrest Gump" } },
			{ type: "actor", data: { id: 32, name: "Robin Wright" } },
			{
				type: "movie",
				data: { id: 1253, title: "Breaking And Entering" },
			},
			{ type: "actor", data: { id: 9642, name: "Jude Law" } },
			{ type: "movie", data: { id: 853, title: "Enemy At The Gates" } },
			{ type: "actor", data: { id: 12763, name: "Joseph Fiennes" } },
			{ type: "movie", data: { id: 1245, title: "Shakespeare In Love" } },
			{ type: "actor", data: { id: 2224, name: "Gwyneth Paltrow" } },
		];
		render(
			<ActorView
				actor={{
					id: 2224,
					name: "Gwyneth Paltrow",
					profile_path: "/sg5Z7nTvEPBqDKULvGXWzJRbnrU.jpg",
					character: "A",
				}}
				stack={stack}
				onMovieClick={() => {}}
				onGameEnd={onGameEnd}
			/>,
		);
		await waitFor(() => expect(onGameEnd).toHaveBeenCalledWith("failure"));
	});

	it("calls onMovieClick when a movie is clicked", async () => {
		const onMovieClick = vi.fn();
		render(
			<ActorView
				actor={{
					id: 1,
					name: "Tom Hanks",
					profile_path: "",
					character: "Forrest Gump",
				}}
				stack={[]}
				onMovieClick={onMovieClick}
			/>,
		);
		const movie = await screen.findByText("Forrest Gump");
		movie.click();
		expect(onMovieClick).toHaveBeenCalledWith(
			expect.objectContaining({
				id: 2,
				title: "Forrest Gump",
				poster_path: "",
				release_date: "1994-07-06",
			}),
		);
	});
});
