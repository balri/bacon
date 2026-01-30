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

	it("renders the accordion button with label and steps remaining count", () => {
		render(<Breadcrumbs stack={stack} />);
		expect(
			screen.getByRole("button", { name: /progress/i }),
		).toBeInTheDocument();
		expect(screen.getByText(/progress/i)).toBeInTheDocument();
		expect(screen.getByText(/5 steps remaining/i)).toBeInTheDocument();
	});

	it("does not show breadcrumbs list when accordion is closed", () => {
		render(<Breadcrumbs stack={stack} />);
		expect(screen.queryByText("Actor One")).not.toBeInTheDocument();
		expect(screen.queryByText("Movie Two")).not.toBeInTheDocument();
		expect(screen.queryByText("Actor Three")).not.toBeInTheDocument();
	});

	it("shows breadcrumbs when accordion is open", () => {
		render(<Breadcrumbs stack={stack} />);
		const accordionBtn = screen.getByRole("button", { name: /progress/i });
		fireEvent.click(accordionBtn);
		expect(screen.getByText("Actor One")).toBeInTheDocument();
		expect(screen.getByText("Movie Two")).toBeInTheDocument();
		expect(screen.getByText("Actor Three")).toBeInTheDocument();
	});

	it("renders clickable buttons for all but last breadcrumb when open", () => {
		const handleClick = vi.fn();
		render(<Breadcrumbs stack={stack} onBreadcrumbClick={handleClick} />);
		const accordionBtn = screen.getByRole("button", { name: /progress/i });
		fireEvent.click(accordionBtn);
		const buttons = screen.getAllByRole("button");
		// The first button is the accordion, next are the breadcrumbs
		expect(buttons[1]).toHaveTextContent("Actor One");
		expect(buttons[2]).toHaveTextContent("Movie Two");
		expect(screen.getByText("Actor Three").tagName).not.toBe("BUTTON");
	});

	it("calls onBreadcrumbClick with correct index when open", () => {
		const handleClick = vi.fn();
		render(<Breadcrumbs stack={stack} onBreadcrumbClick={handleClick} />);
		const accordionBtn = screen.getByRole("button", { name: /progress/i });
		fireEvent.click(accordionBtn);
		const buttons = screen.getAllByRole("button");
		fireEvent.click(buttons[2]); // Movie Two
		expect(handleClick).toHaveBeenCalledWith(1);
		fireEvent.click(buttons[1]); // Actor One
		expect(handleClick).toHaveBeenCalledWith(0);
	});

	it("applies clickable and not-clickable classes correctly when open", () => {
		const handleClick = vi.fn();
		render(<Breadcrumbs stack={stack} onBreadcrumbClick={handleClick} />);
		const accordionBtn = screen.getByRole("button", { name: /progress/i });
		fireEvent.click(accordionBtn);
		const buttons = screen.getAllByRole("button");
		// Skip the first button (accordion)
		buttons.slice(1).forEach((btn) => {
			expect(btn.className).toMatch(/breadcrumb-clickable/);
		});
		const last = screen.getByText("Actor Three");
		expect(last.className).toMatch(/breadcrumb-not-clickable/);
	});
});
