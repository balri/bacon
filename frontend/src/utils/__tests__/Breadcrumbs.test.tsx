import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect } from "vitest";

import Breadcrumbs from "../Breadcrumbs";
import type { Actor, Movie } from "../../api";

describe("Breadcrumbs", () => {
	it("renders breadcrumbs", () => {
		const stack: Array<{ type: "actor" | "movie"; data: Actor | Movie }> = [
			{ type: "actor", data: { id: 1, name: "Actor One" } as Actor },
			{ type: "movie", data: { id: 2, title: "Movie Two" } as Movie },
			{ type: "actor", data: { id: 3, name: "Actor Three" } as Actor },
		];
		render(<Breadcrumbs stack={stack} />);
		expect(screen.getByText("Actor One")).toBeInTheDocument();
		expect(screen.getByText("Movie Two")).toBeInTheDocument();
		expect(screen.getByText("Actor Three")).toBeInTheDocument();
	});
});
