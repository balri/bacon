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

	it("renders failure message with actor name and attempts", () => {
		render(<FailureMessage firstActor={baseActor} attempts={3} />);
		expect(screen.getByText(/No Connection/i)).toBeInTheDocument();
		expect(screen.getByText(/Tom Hanks/)).toBeInTheDocument();
		expect(screen.getByTestId("attempts")).toContainHTML("2");
		expect(screen.getByText(/Try again tomorrow/i)).toBeInTheDocument();
	});

	it("renders actor photo if profile_path is present", () => {
		render(<FailureMessage firstActor={baseActor} attempts={2} />);
		const img = screen.getByAltText("Tom Hanks");
		expect(img).toBeInTheDocument();
		expect(img).toHaveAttribute("src", expect.stringContaining("/tom.jpg"));
	});

	it("renders placeholder if no profile_path", () => {
		const actorNoPhoto = { ...baseActor, profile_path: undefined };
		render(<FailureMessage firstActor={actorNoPhoto} attempts={1} />);
		expect(screen.getByText(/Tom Hanks/)).toBeInTheDocument();
		// Should not find an image
		expect(screen.queryByAltText("Tom Hanks")).not.toBeInTheDocument();
	});
});
