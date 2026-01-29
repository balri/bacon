import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect } from "vitest";

import EndMessage from "../EndMessage";

describe("EndMessage", () => {
	it("renders end message and play again button", () => {
		render(
			<EndMessage
				endMessage="Game Over"
				loadActor={() => {}}
				handleBack={() => {}}
				showBackButton={true}
				showTryAgainButton={true}
			/>,
		);
		expect(screen.getByText("Game Over")).toBeInTheDocument();
		expect(screen.getByText("🔀 Start Again")).toBeInTheDocument();
		expect(screen.getByText("← Back")).toBeInTheDocument();
	});

	it("does not render try again button if showTryAgainButton is false", () => {
		render(
			<EndMessage
				endMessage="Game Over"
				loadActor={() => {}}
				handleBack={() => {}}
				showTryAgainButton={false}
			/>,
		);
		expect(screen.queryByText("🔀 Start Again")).not.toBeInTheDocument();
	});

	it("does not render back button if showBackButton is false", () => {
		render(
			<EndMessage
				endMessage="Game Over"
				loadActor={() => {}}
				handleBack={() => {}}
				showBackButton={false}
			/>,
		);
		expect(screen.queryByText("← Back")).not.toBeInTheDocument();
	});
});
