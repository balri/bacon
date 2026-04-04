import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect } from "vitest";

import FailureMessage from "../FailureMessage";

describe("FailureMessage", () => {
	const baseActor = {
		id: 1,
		name: "Tom Hanks",
		profile_path: "/tom.jpg",
		character: "A",
	};

	it("renders failure message with actor name", () => {
		render(<FailureMessage firstActor={baseActor} />);
		expect(screen.getByText(/No Connection/i)).toBeInTheDocument();
		expect(screen.getAllByText(/Tom Hanks/).length).toBeGreaterThan(0);
		expect(screen.getByText(/You failed to connect/i)).toBeInTheDocument();
	});

	it("renders actor photo if profile_path is present", () => {
		render(<FailureMessage firstActor={baseActor} />);
		const img = screen.getByAltText("Tom Hanks");
		expect(img).toBeInTheDocument();
		expect(img).toHaveAttribute("src", expect.stringContaining("/tom.jpg"));
	});

	it("renders placeholder if no profile_path", () => {
		const actorNoPhoto = { ...baseActor, profile_path: undefined };
		render(<FailureMessage firstActor={actorNoPhoto} />);
		expect(screen.getAllByText(/Tom Hanks/).length).toBeGreaterThan(0);
		// Should not find an image
		expect(screen.queryByAltText("Tom Hanks")).not.toBeInTheDocument();
	});
});
