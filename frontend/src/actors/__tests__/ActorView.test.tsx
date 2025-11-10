import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect, vi } from "vitest";

import * as api from "../../api";
import ActorView from "../ActorView";

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

	it("does not list movies already in the stack", async () => {
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
		expect(screen.queryByText("Big")).not.toBeInTheDocument();
		expect(await screen.findByText("Forrest Gump")).toBeInTheDocument();
	});
});
