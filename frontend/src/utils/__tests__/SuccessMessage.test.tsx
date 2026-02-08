import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect, vi } from "vitest";

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
				degrees={3}
				attempts={2}
				streak={5}
			/>,
		);
		expect(screen.getByText(/Tom Hanks/)).toBeInTheDocument();
		expect(screen.getByTestId("degrees")).toContainHTML("3");
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
				degrees={3}
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
				degrees={3}
				attempts={2}
				streak={5}
			/>,
		);
		expect(screen.queryByAltText("Tom Hanks")).not.toBeInTheDocument();
	});
});

describe("SuccessMessage share link", () => {
	const defaultProps = {
		firstActor: {
			id: 1,
			name: "Test Actor",
			profile_path: "",
			bacon_number: 2,
		},
		degrees: 3,
		attempts: 1,
		numSolved: 5,
		longestStreak: 3,
		streak: 2,
	};

	const setup = (mockShare: PropertyDescriptor & ThisType<any>) => {
		Object.defineProperty(window.navigator, "share", mockShare);
	};

	it("renders the share button", () => {
		render(<SuccessMessage {...defaultProps} />);
		expect(
			screen.getByRole("button", { name: /share/i }),
		).toBeInTheDocument();
	});


	it("calls navigator.share if available and passes correct share text", () => {
		const mockShare = vi.fn();
		setup({
			value: mockShare,
			configurable: true,
			writable: true,
		});
		render(<SuccessMessage {...defaultProps} />);
		fireEvent.click(screen.getByRole("button", { name: /share/i }));
		expect(mockShare).toHaveBeenCalled();
		const callArg = mockShare.mock.calls[0][0];
		expect(callArg).toHaveProperty("text");
		expect(callArg.text).toMatch(
			/I connected Test Actor to Kevin Bacon in 3 steps! Can you beat my score\? Play now!/i
		);
	});

	it("calls navigator.share with optimal share text when degrees=1", () => {
		const mockShare = vi.fn();
		setup({
			value: mockShare,
			configurable: true,
			writable: true,
		});
		render(
			<SuccessMessage
				{...defaultProps}
				degrees={1}
			/>
		);
		fireEvent.click(screen.getByRole("button", { name: /share/i }));
		expect(mockShare).toHaveBeenCalled();
		const callArg = mockShare.mock.calls[0][0];
		expect(callArg).toHaveProperty("text");
		expect(callArg.text).toMatch(
			/I connected Test Actor to Kevin Bacon in the optimal steps! Can you do the same\? Play now!/i
		);
	});

	it("calls navigator.share with optimal share text when optimal steps", () => {
		const mockShare = vi.fn();
		setup({
			value: mockShare,
			configurable: true,
			writable: true,
		});
		render(
			<SuccessMessage
				{...defaultProps}
				degrees={2}
			/>
		);
		fireEvent.click(screen.getByRole("button", { name: /share/i }));
		expect(mockShare).toHaveBeenCalled();
		const callArg = mockShare.mock.calls[0][0];
		expect(callArg).toHaveProperty("text");
		expect(callArg.text).toMatch(
			/I connected Test Actor to Kevin Bacon in the optimal steps! Can you do the same\? Play now!/i
		);
	});

	it("shows input and copy button if navigator.share is not available", async () => {
		setup({ value: undefined });
		render(<SuccessMessage {...defaultProps} />);
		fireEvent.click(screen.getByRole("button", { name: /share/i }));
		expect(
			screen.getByDisplayValue(window.location.href),
		).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /copy/i }),
		).toBeInTheDocument();
	});

	it("copies the link and shows confirmation", async () => {
		setup({ value: undefined });
		Object.defineProperty(window.navigator, "clipboard", {
			value: { writeText: vi.fn().mockResolvedValue(0) },
			writable: true,
		});
		render(<SuccessMessage {...defaultProps} />);
		fireEvent.click(screen.getByRole("button", { name: /share/i }));
		fireEvent.click(screen.getByRole("button", { name: /copy/i }));
		await waitFor(() => {
			expect(screen.getByText(/link copied/i)).toBeInTheDocument();
		});
		expect(window.navigator.clipboard.writeText).toHaveBeenCalledWith(
			window.location.href,
		);
	});
});
