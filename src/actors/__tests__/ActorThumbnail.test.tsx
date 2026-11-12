import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect } from "vitest";

import ActorThumbnail from "../ActorThumbnail";

describe("ActorThumbnail", () => {
	it("renders thumbnail image with alt text", () => {
		render(
			<ActorThumbnail id={1} name="Tom Hanks" profile_path="/tom.jpg" />,
		);
		const img = screen.getByAltText("Tom Hanks");
		expect(img).toBeInTheDocument();
		expect(img).toHaveAttribute("src", expect.stringContaining("/tom.jpg"));
	});
});
