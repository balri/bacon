import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect, vi } from "vitest";

import Breadcrumbs from "../Breadcrumbs";
import type { Actor, Movie } from "../../api";

describe("Breadcrumbs", () => {
	const stack: Array<{ type: "actor" | "movie"; data: Actor | Movie }> = [
		{ type: "actor", data: { id: 1, name: "Actor One" } as Actor },
		{ type: "movie", data: { id: 2, title: "Movie Two" } as Movie },
		{ type: "actor", data: { id: 3, name: "Actor Three" } as Actor },
	];

	it("renders breadcrumbs", () => {
		render(<Breadcrumbs stack={stack} />);
		expect(screen.getByText("Actor One")).toBeInTheDocument();
		expect(screen.getByText("Movie Two")).toBeInTheDocument();
		expect(screen.getByText("Actor Three")).toBeInTheDocument();
	});

	it("renders clickable buttons for all but last breadcrumb", () => {
		const handleClick = vi.fn();
		render(<Breadcrumbs stack={stack} onBreadcrumbClick={handleClick} />);
		const buttons = screen.getAllByRole("button");
		expect(buttons).toHaveLength(2);
		expect(buttons[0]).toHaveTextContent("Actor One");
		expect(buttons[1]).toHaveTextContent("Movie Two");
		expect(screen.getByText("Actor Three").tagName).not.toBe("BUTTON");
	});

	it("calls onBreadcrumbClick with correct index", () => {
		const handleClick = vi.fn();
		render(<Breadcrumbs stack={stack} onBreadcrumbClick={handleClick} />);
		const buttons = screen.getAllByRole("button");
		fireEvent.click(buttons[1]);
		expect(handleClick).toHaveBeenCalledWith(1);
		fireEvent.click(buttons[0]);
		expect(handleClick).toHaveBeenCalledWith(0);
	});

	it("applies clickable and not-clickable classes correctly", () => {
		const handleClick = vi.fn();
		render(<Breadcrumbs stack={stack} onBreadcrumbClick={handleClick} />);
		const buttons = screen.getAllByRole("button");
		buttons.forEach((btn) => {
			expect(btn.className).toMatch(/breadcrumb-clickable/);
		});
		const last = screen.getByText("Actor Three");
		expect(last.className).toMatch(/breadcrumb-not-clickable/);
	});
});
