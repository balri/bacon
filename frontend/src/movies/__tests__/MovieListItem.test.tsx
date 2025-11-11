import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, vi, expect } from "vitest";

import MovieListItem from "../MovieListItem";
import type { Movie } from "../../api";

describe("MovieListItem", () => {
	it("renders movie title and handles click", () => {
		const movie: Movie = {
			id: 1,
			title: "Forrest Gump",
		};
		const onClick = vi.fn();
		render(
			<MovieListItem
				key={movie.id}
				movie={movie}
				onMovieClick={onClick}
			/>,
		);
		const item = screen.getByText("Forrest Gump");
		expect(item).toBeInTheDocument();
		fireEvent.click(item);
		expect(onClick).toHaveBeenCalledWith(movie);
	});

	it("renders movie thumbnail when poster_path is present", () => {
		const movie: Movie = {
			id: 2,
			title: "Inception",
			poster_path: "/path/to/poster.jpg",
		};
		const onClick = vi.fn();
		render(
			<MovieListItem
				key={movie.id}
				movie={movie}
				onMovieClick={onClick}
			/>,
		);
		const thumbnail = screen.getByAltText("Inception");
		expect(thumbnail).toBeInTheDocument();
	});

	it("does not render thumbnail when poster_path is absent", () => {
		const movie: Movie = {
			id: 3,
			title: "Unknown Movie",
		};
		const onClick = vi.fn();
		render(
			<MovieListItem
				key={movie.id}
				movie={movie}
				onMovieClick={onClick}
			/>,
		);
		const thumbnail = screen.queryByAltText("Unknown Movie");
		expect(thumbnail).not.toBeInTheDocument();
	});

	it("renders release year when release_date is present", () => {
		const movie: Movie = {
			id: 4,
			title: "The Matrix",
			release_date: "1999-03-31",
		};
		const onClick = vi.fn();
		render(
			<MovieListItem
				key={movie.id}
				movie={movie}
				onMovieClick={onClick}
			/>,
		);
		const year = screen.getByText("(1999)");
		expect(year).toBeInTheDocument();
	});

	it("does not render release year when release_date is absent", () => {
		const movie: Movie = {
			id: 5,
			title: "No Date Movie",
		};
		const onClick = vi.fn();
		render(
			<MovieListItem
				key={movie.id}
				movie={movie}
				onMovieClick={onClick}
			/>,
		);
		const year = screen.queryByText(/\(\d{4}\)/);
		expect(year).not.toBeInTheDocument();
	});

	it("renders rating when vote_average is present", () => {
		const movie: Movie = {
			id: 5,
			title: "The Dark Knight",
			vote_average: 8.7,
		};
		const onClick = vi.fn();
		render(
			<MovieListItem
				key={movie.id}
				movie={movie}
				onMovieClick={onClick}
			/>,
		);
		const rating = screen.getByText("⭐ 8.7");
		expect(rating).toBeInTheDocument();
	});

	it("does not render rating when vote_average is absent", () => {
		const movie: Movie = {
			id: 6,
			title: "No Rating Movie",
		};
		const onClick = vi.fn();
		render(
			<MovieListItem
				key={movie.id}
				movie={movie}
				onMovieClick={onClick}
			/>,
		);
		const rating = screen.queryByText(/⭐/);
		expect(rating).not.toBeInTheDocument();
	});
});
