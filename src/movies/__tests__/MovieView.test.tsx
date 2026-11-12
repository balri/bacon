import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect, vi } from "vitest";

import MovieView from "../MovieView";
import * as api from "../../api";

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

	it("lists actors already in the stack", async () => {
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
		expect(await screen.findByTestId("actor-item")).toHaveTextContent(
			"Robin Wright",
		);
		expect(
			await screen.findByTestId("selected-actor-item"),
		).toHaveTextContent("Tom Hanks");
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
