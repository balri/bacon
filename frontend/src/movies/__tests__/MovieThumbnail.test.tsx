import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect } from "vitest";

import MovieThumbnail from "../MovieThumbnail";

describe("MovieThumbnail", () => {
	it("renders thumbnail image with alt text", () => {
		render(
			<MovieThumbnail
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
