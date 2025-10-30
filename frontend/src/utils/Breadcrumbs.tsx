import type { Actor, Movie } from "../api";

interface BreadcrumbsProps {
	stack: Array<{ type: "actor" | "movie"; data: Actor | Movie }>;
}

export default function Breadcrumbs({
	stack,
}: BreadcrumbsProps) {
	return (
		<nav className="breadcrumb-vertical">
			{stack.map((item, idx) => {
				const indent = idx * 6;
				return (
					<div
						key={idx}
						className={`breadcrumb-vertical-item ${item.type === "actor"
							? "breadcrumb-actor"
							: "breadcrumb-movie breadcrumb-movie-truncate"
							}`}
						title={
							item.type === "movie"
								? (item.data as Movie).title
								: undefined
						}
						style={{
							marginLeft: `${indent}px`,
							width: `calc(100% - ${indent}px)`,
							cursor:
								idx < stack.length - 1 ? "pointer" : "default",
						}}
					>
						{item.type === "actor"
							? (item.data as Actor).name
							: (item.data as Movie).title}
					</div>
				);
			})}
		</nav>
	);
}
