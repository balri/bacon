import type { Actor, Movie } from "../api";

interface BreadcrumbsProps {
	stack: Array<{ type: "actor" | "movie"; data: Actor | Movie }>;
	onBreadcrumbClick?: (index: number) => void;
}

export default function Breadcrumbs({
	stack,
	onBreadcrumbClick,
}: BreadcrumbsProps) {
	return (
		<nav className="breadcrumb-vertical">
			{stack.map((item, idx) => {
				const indent = idx * 6;
				const isClickable =
					idx < stack.length - 1 && !!onBreadcrumbClick;
				const label =
					item.type === "actor"
						? (item.data as Actor).name
						: (item.data as Movie).title;
				const commonProps = {
					key: idx,
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
				if (isClickable) {
					return (
						<button
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
						{...commonProps}
						className={
							commonProps.className + " breadcrumb-not-clickable"
						}
					>
						{label}
					</div>
				);
			})}
		</nav>
	);
}
