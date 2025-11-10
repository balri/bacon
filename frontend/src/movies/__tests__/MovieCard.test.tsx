import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, expect, it } from "vitest";

import MovieCard from "../MovieCard";

describe("MovieCard", () => {
	it("renders movie name and character", () => {
		render(
			<MovieCard
				movie={{
					id: 1,
					title: "Forrest Gump",
				}}
			/>,
		);
		expect(screen.getByText("Forrest Gump")).toBeInTheDocument();
	});

	it("renders movie image when poster_path is available", () => {
		render(
			<MovieCard
				movie={{
					id: 2,
					title: "Inception",
					poster_path: "/inception.jpg",
				}}
			/>,
		);
		const img = screen.getByRole("img") as HTMLImageElement;
		expect(img).toBeInTheDocument();
		expect(img.src).toContain("/inception.jpg");
	});

	it("does not render movie image when poster_path is not set", () => {
		render(
			<MovieCard
				movie={{
					id: 3,
					title: "Unknown Movie",
					poster_path: "",
				}}
			/>,
		);
		const img = screen.queryByRole("img");
		expect(img).not.toBeInTheDocument();
	});
});
