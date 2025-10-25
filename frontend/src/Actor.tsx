import { useEffect, useState } from "react";
import { getMoviesForActor, type Actor, type Movie } from "./api";
import Loading from "./Loading";
import ActorImage from "./ActorImage";

interface ActorProps {
	actor: Actor;
}

export default function Actor({ actor }: ActorProps) {
	const [movies, setMovies] = useState<Movie[] | null>(null);
	const [loading, setLoading] = useState(true);

	async function loadMovies() {
		setLoading(true);
		const movies = await getMoviesForActor(actor.id);
		setMovies(movies);
		setLoading(false);
	}

	useEffect(() => {
		loadMovies();
	}, []);

	if (loading) {
		return <Loading />;
	}

	return (
		<div>
			<div className="actor-card">
				{actor.profile_path && (
					<ActorImage {...actor} />
				)}
				<h2 className="actor-name">{actor.name}</h2>
			</div>
			<h3 className="movies-title">Select a movie:</h3>
			<ul className="movie-list">
				{movies && movies.length > 0 ? movies.map((m) => (
					<li key={m.id} className="movie-item">
						<span className="movie-title">{m.title}</span>
						{m.release_date && (
							<span className="movie-year">
								{" "}
								({new Date(m.release_date).getFullYear()})
							</span>
						)}
						{m.vote_average && (
							<span className="movie-rating">
								{" "}
								⭐ {m.vote_average.toFixed(1)}
							</span>
						)}
					</li>
				)) : (
					<li className="error-message">
						❌ No movies found for this actor.
					</li>
				)}
			</ul>
		</div>
	);
}
