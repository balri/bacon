import type { Actor, Movie } from "../api";

interface BreadcrumbsProps {
	stack: Array<{ type: "actor" | "movie"; data: Actor | Movie }>;
	onCrumbClick: (index: number) => void;
}

export default function Breadcrumbs({
	stack,
	onCrumbClick,
}: BreadcrumbsProps) {
	return (
		<nav className="breadcrumb">
			{stack.map((item, idx) => (
				<span key={idx}>
					{idx > 0 && <span className="breadcrumb-sep"> &gt; </span>}
					<span
						className={
							item.type === "actor"
								? "breadcrumb-actor"
								: "breadcrumb-movie breadcrumb-movie-truncate"
						}
						title={
							item.type === "movie"
								? (item.data as Movie).title
								: undefined
						}
						style={{
							cursor:
								idx < stack.length - 1 ? "pointer" : "default",
						}}
						onClick={() => idx < stack.length - 1 && onCrumbClick(idx)}
					>
						{item.type === "actor"
							? (item.data as Actor).name
							: (item.data as Movie).title}
					</span>
				</span>
			))}
		</nav>
	);
}
