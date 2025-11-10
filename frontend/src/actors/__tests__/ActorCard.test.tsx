import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, expect, it } from "vitest";

import ActorCard from "../ActorCard";

describe("ActorCard", () => {
	it("renders actor name and character", () => {
		render(
			<ActorCard
				actor={{
					id: 1,
					name: "Tom Hanks",
					profile_path: "/tom.jpg",
					character: "Forrest Gump",
				}}
			/>,
		);
		expect(screen.getByText("Tom Hanks")).toBeInTheDocument();
	});

	it("renders actor image when profile_path is available", () => {
		render(
			<ActorCard
				actor={{
					id: 2,
					name: "Leonardo DiCaprio",
					profile_path: "/leo.jpg",
					character: "Jack Dawson",
				}}
			/>,
		);
		const img = screen.getByRole("img") as HTMLImageElement;
		expect(img).toBeInTheDocument();
		expect(img.src).toContain("/leo.jpg");
	});

	it("does not render actor image when profile_path is not set", () => {
		render(
			<ActorCard
				actor={{
					id: 3,
					name: "Unknown Actor",
					profile_path: "",
					character: "Mystery Role",
				}}
			/>,
		);
		const img = screen.queryByRole("img");
		expect(img).not.toBeInTheDocument();
	});
});
