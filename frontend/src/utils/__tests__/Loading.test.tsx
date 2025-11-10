import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect } from "vitest";

import Loading from "../Loading";

describe("Loading", () => {
	it("renders loading spinner and text (default)", () => {
		render(<Loading />);
		expect(screen.getByText(/loading/i)).toBeInTheDocument();
		expect(
			document.querySelector(".loading-container"),
		).toBeInTheDocument();
		expect(document.querySelector(".loading-spinner")).toBeInTheDocument();
	});

	it("renders small loading spinner and text", () => {
		render(<Loading small />);
		expect(screen.getByText(/loading/i)).toBeInTheDocument();
		expect(
			document.querySelector(".loading-small-container"),
		).toBeInTheDocument();
		expect(
			document.querySelector(".loading-small-spinner"),
		).toBeInTheDocument();
		expect(
			document.querySelector(".loading-small-text"),
		).toBeInTheDocument();
	});

	it("renders tiny loading spinner without text", () => {
		render(<Loading tiny />);
		expect(
			document.querySelector(".loading-tiny-container"),
		).toBeInTheDocument();
		expect(
			document.querySelector(".loading-tiny-spinner"),
		).toBeInTheDocument();
		expect(
			document.querySelector(".loading-tiny-text"),
		).not.toBeInTheDocument();
		expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
	});
});
