import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, vi, expect } from "vitest";

import ActorListItem from "../ActorListItem";

describe("ActorListItem", () => {
	it("renders actor name and handles click", () => {
		const actor = {
			id: 1,
			name: "Tom Hanks",
			profile_path: "",
			character: "A",
		};
		const onClick = vi.fn();
		render(
			<ActorListItem
				key={actor.id}
				actor={actor}
				onActorClick={onClick}
			/>,
		);
		const item = screen.getByText("Tom Hanks");
		expect(item).toBeInTheDocument();
		fireEvent.click(item);
		expect(onClick).toHaveBeenCalledWith(actor);
	});

	it("renders actor thumbnail when profile_path is present", () => {
		const actor = {
			id: 2,
			name: "Scarlett Johansson",
			profile_path: "/path/to/profile.jpg",
			character: "B",
		};
		const onClick = vi.fn();
		render(
			<ActorListItem
				key={actor.id}
				actor={actor}
				onActorClick={onClick}
			/>,
		);
		const thumbnail = screen.getByAltText("Scarlett Johansson");
		expect(thumbnail).toBeInTheDocument();
	});

	it("does not render thumbnail when profile_path is absent", () => {
		const actor = {
			id: 3,
			name: "Unknown Actor",
			profile_path: "",
			character: "C",
		};
		const onClick = vi.fn();
		render(
			<ActorListItem
				key={actor.id}
				actor={actor}
				onActorClick={onClick}
			/>,
		);
		const thumbnail = screen.queryByAltText("Unknown Actor");
		expect(thumbnail).not.toBeInTheDocument();
	});

	it("renders character name if available", () => {
		const actor = {
			id: 4,
			name: "Chris Evans",
			profile_path: "",
			character: "Captain America",
		};
		const onClick = vi.fn();
		render(
			<ActorListItem
				key={actor.id}
				actor={actor}
				onActorClick={onClick}
			/>,
		);
		const character = screen.getByText("as Captain America");
		expect(character).toBeInTheDocument();
	});

	it("does not render character name if not available", () => {
		const actor = {
			id: 5,
			name: "Chris Hemsworth",
			profile_path: "",
			character: "",
		};
		const onClick = vi.fn();
		render(
			<ActorListItem
				key={actor.id}
				actor={actor}
				onActorClick={onClick}
			/>,
		);
		const character = screen.queryByText(/as/i);
		expect(character).not.toBeInTheDocument();
	});
});
