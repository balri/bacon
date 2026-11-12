import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, vi, expect } from "vitest";

import ActorList from "../ActorList";
import type { Actor } from "../../utils/types";

describe("ActorList", () => {
	it("renders a list of actors and handles click", () => {
		const actors: Actor[] = [
			{ id: 1, name: "Tom Hanks", profile_path: "", character: "A" },
			{ id: 2, name: "Meg Ryan", profile_path: "", character: "B" },
		];
		const onActorClick = vi.fn();
		render(
			<ActorList
				actors={actors}
				onActorClick={onActorClick}
				stack={[]}
			/>,
		);
		expect(screen.getByText("Tom Hanks")).toBeInTheDocument();
		expect(screen.getByText("Meg Ryan")).toBeInTheDocument();
		fireEvent.click(screen.getByText("Tom Hanks"));
		expect(onActorClick).toHaveBeenCalledWith(actors[0]);
	});

	it("renders no actors message when list is empty", () => {
		const actors: Actor[] = [];
		const onActorClick = vi.fn();
		render(
			<ActorList
				actors={actors}
				onActorClick={onActorClick}
				stack={[]}
			/>,
		);
		expect(
			screen.getByText("❌ No cast found for this movie."),
		).toBeInTheDocument();
	});
});
