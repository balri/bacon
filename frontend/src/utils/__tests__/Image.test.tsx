import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect } from "vitest";

import Image from "../Image";

describe("Image", () => {
	it("renders image with alt text", () => {
		render(<Image url="/test.jpg" alt="Test" />);
		const img = screen.getByAltText("Test");
		expect(img).toBeInTheDocument();
		expect(img).toHaveAttribute("src", "/test.jpg");
	});

	it("shows loading overlay before image loads and hides it after", () => {
		render(<Image url="/test.jpg" alt="Test" />);
		expect(screen.getByText(/loading/i)).toBeInTheDocument();

		const img = screen.getByAltText("Test");
		fireEvent.load(img);

		expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
	});
});
