import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect } from "vitest";

import SuccessMessage from "../SuccessMessage";

describe("SuccessMessage", () => {
	it("renders success message with actor and movie", () => {
		render(
			<SuccessMessage
				firstActor={{
					id: 1,
					name: "Tom Hanks",
					profile_path: "",
					character: "A",
				}}
				steps={3}
				attempts={2}
				streak={5}
			/>,
		);
		expect(screen.getByText(/Tom Hanks/)).toBeInTheDocument();
		expect(screen.getByTestId("steps")).toContainHTML("3");
		expect(screen.getByTestId("attempts")).toContainHTML("2");
		expect(screen.getByTestId("streak")).toContainHTML("5");
	});

	it("renders image if firstActor has profile_path", () => {
		render(
			<SuccessMessage
				firstActor={{
					id: 1,
					name: "Tom Hanks",
					profile_path: "/tommyboy.jpg",
					character: "A",
				}}
				steps={3}
				attempts={2}
				streak={5}
			/>,
		);
		const img = screen.getByAltText("Tom Hanks");
		expect(img).toBeInTheDocument();
		expect(img).toHaveAttribute(
			"src",
			expect.stringContaining("/tommyboy.jpg"),
		);
	});

	it("does not render image if firstActor has no profile_path", () => {
		render(
			<SuccessMessage
				firstActor={{
					id: 1,
					name: "Tom Hanks",
					profile_path: "",
					character: "A",
				}}
				steps={3}
				attempts={2}
				streak={5}
			/>,
		);
		expect(screen.queryByAltText("Tom Hanks")).not.toBeInTheDocument();
	});
});
