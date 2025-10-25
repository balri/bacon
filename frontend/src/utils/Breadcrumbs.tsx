import type { Actor, Movie } from "../api";

interface BreadcrumbsProps {
	actor: Actor;
	movie: Movie;
}

export default function Breadcrumbs({
	actor,
	movie,
}: BreadcrumbsProps) {
	return (
		<nav className="breadcrumb">
			{actor && (
				<span className="breadcrumb-actor">{actor.name}</span>
			)}
			{movie && (
				<>
					<span className="breadcrumb-sep"> &gt; </span>
					<span className="breadcrumb-movie">{movie.title}</span>
				</>
			)}
		</nav>
	);
}
