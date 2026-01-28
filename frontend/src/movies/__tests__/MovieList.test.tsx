import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, vi, expect } from "vitest";

import MovieList from "../MovieList";
import type { Movie } from "../../api";

describe("MovieList", () => {
	it("renders a list of movies and handles click", () => {
		const movies: Movie[] = [
			{ id: 1, title: "Forrest Gump" },
			{ id: 2, title: "You've Got Mail" },
		];
		const onMovieClick = vi.fn();
		render(<MovieList movies={movies} onMovieClick={onMovieClick} alreadySelected={false} />);
		expect(screen.getByText("Forrest Gump")).toBeInTheDocument();
		expect(screen.getByText("You've Got Mail")).toBeInTheDocument();
		fireEvent.click(screen.getByText("Forrest Gump"));
		expect(onMovieClick).toHaveBeenCalledWith(movies[0]);
	});

	it("renders no movies message when list is empty", () => {
		const movies: Movie[] = [];
		const onMovieClick = vi.fn();
		render(<MovieList movies={movies} onMovieClick={onMovieClick} alreadySelected={false} />);
		expect(
			screen.getByText("❌ No movies found for this actor."),
		).toBeInTheDocument();
	});
});
