import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect } from "vitest";

import SuccessMessage from "../SuccessMessage";

describe("SuccessMessage", () => {
	it("renders success message with actor and movie", () => {
		render(
			<SuccessMessage
				firstActor={{
					id: 1,
					name: "Tom Hanks",
					profile_path: "",
					character: "A",
				}}
				lastActor={{
					id: 2,
					name: "Kevin Bacon",
					profile_path: "",
					character: "B",
				}}
				degrees={3}
			/>,
		);
		expect(screen.getByText(/Tom Hanks/)).toBeInTheDocument();
		expect(screen.getByText(/Kevin Bacon/)).toBeInTheDocument();
		expect(screen.getByText(/3 degrees/)).toBeInTheDocument();
	});

	it("renders image if lastActor has profile_path", () => {
		render(
			<SuccessMessage
				firstActor={{
					id: 1,
					name: "Tom Hanks",
					profile_path: "",
					character: "A",
				}}
				lastActor={{
					id: 2,
					name: "Kevin Bacon",
					profile_path: "/bacon.jpg",
					character: "B",
				}}
				degrees={3}
			/>,
		);
		const img = screen.getByAltText("Kevin Bacon");
		expect(img).toBeInTheDocument();
		expect(img).toHaveAttribute(
			"src",
			expect.stringContaining("/bacon.jpg"),
		);
	});

	it("does not render image if lastActor has no profile_path", () => {
		render(
			<SuccessMessage
				firstActor={{
					id: 1,
					name: "Tom Hanks",
					profile_path: "",
					character: "A",
				}}
				lastActor={{
					id: 2,
					name: "Kevin Bacon",
					profile_path: "",
					character: "B",
				}}
				degrees={3}
			/>,
		);
		expect(screen.queryByAltText("Kevin Bacon")).not.toBeInTheDocument();
	});
});
