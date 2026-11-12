import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect } from "vitest";

import IntroMessage from "../IntroMessage";

describe("IntroMessage", () => {
	it("renders intro message", () => {
		render(<IntroMessage onStart={() => {}} />);
		expect(
			screen.getByText("Welcome to Six Degrees of Kevin Bacon!"),
		).toBeInTheDocument();
	});
});
