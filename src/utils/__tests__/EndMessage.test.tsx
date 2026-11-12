import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect } from "vitest";

import EndMessage from "../EndMessage";

describe("EndMessage", () => {
	it("renders end message", () => {
		render(<EndMessage endMessage="Game Over" stack={[]} />);
		expect(screen.getByText("Game Over")).toBeInTheDocument();
		expect(screen.queryByText("🔀 Start Again")).not.toBeInTheDocument();
		expect(screen.queryByText("← Back")).not.toBeInTheDocument();
	});
});
