import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect } from "vitest";

import MovieImage from "../MovieImage";

describe("MovieImage", () => {
	it("renders movie image with alt text", () => {
		render(
			<MovieImage
				id={1}
				title="Forrest Gump"
				poster_path="/forrest.jpg"
			/>,
		);
		const img = screen.getByAltText("Forrest Gump");
		expect(img).toBeInTheDocument();
		expect(img).toHaveAttribute(
			"src",
			expect.stringContaining("/forrest.jpg"),
		);
	});
});
