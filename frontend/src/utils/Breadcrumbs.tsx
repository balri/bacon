import React from "react";

import type { Actor, Movie } from "../api";
import { SIX_DEGREES } from "../App";

interface BreadcrumbsProps {
	stack: Array<{ type: "actor" | "movie"; data: Actor | Movie }>;
	onBreadcrumbClick?: (index: number) => void;
}

export default function Breadcrumbs({
	stack,
	onBreadcrumbClick,
}: BreadcrumbsProps) {
	const [open, setOpen] = React.useState(false);
	const steps = stack.filter((item) => item.type === "actor").length - 1;
	const stepsRemaining = SIX_DEGREES - steps;

	return (
		<nav className="breadcrumb-vertical" style={{ display: "block" }}>
			<button
				aria-expanded={open ? "true" : "false"}
				aria-controls="breadcrumbs-accordion"
				onClick={() => setOpen((prev: boolean) => !prev)}
				className="breadcrumb-accordion"
				tabIndex={0}
			>
				<span className="breadcrumb-accordion-title">Progress</span>
				<span style={{ flexShrink: 0 }}>
					<span className="breadcrumb-accordion-steps">{`${stepsRemaining} step${stepsRemaining !== 1 ? "s" : ""} remaining`}</span>
					<svg
						className="breadcrumb-accordion-icon"
						style={{
							transform: open ? "rotate(90deg)" : "rotate(0deg)",
						}}
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						viewBox="0 0 20 20"
						aria-hidden="true"
					>
						<polyline points="6 8 10 12 14 8" />
					</svg>
				</span>
			</button>
			{open && (
				<ol
					id="breadcrumbs-accordion"
					className="breadcrumb-accordion-list"
				>
					{stack.map((item, idx) => {
						const indent = idx * 6;
						const isClickable =
							idx < stack.length - 1 && !!onBreadcrumbClick;
						const label =
							item.type === "actor"
								? (item.data as Actor).name
								: (item.data as Movie).title;
						const commonProps = {
							className:
								"breadcrumb-vertical-item " +
								(item.type === "actor"
									? "breadcrumb-actor"
									: "breadcrumb-movie breadcrumb-movie-truncate"),
							title: label,
							style: {
								marginLeft: `${indent}px`,
								width: `calc(100% - ${indent}px)`,
								cursor: isClickable ? "pointer" : "default",
							},
						};
						const key =
							item.type === "actor"
								? `actor-${(item.data as Actor).id}`
								: `movie-${(item.data as Movie).id}`;
						if (isClickable) {
							return (
								<button
									key={key}
									{...commonProps}
									type="button"
									onClick={() => onBreadcrumbClick?.(idx)}
									style={commonProps.style}
									tabIndex={0}
									className={
										commonProps.className +
										" breadcrumb-btn-reset breadcrumb-clickable"
									}
								>
									{label}
								</button>
							);
						}

						return (
							<div
								key={key}
								{...commonProps}
								className={
									commonProps.className +
									" breadcrumb-not-clickable"
								}
							>
								{label}
							</div>
						);
					})}
				</ol>
			)}
		</nav>
	);
}
