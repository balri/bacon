const BASE_URL = "http://localhost:3000/api";

export interface Actor {
	id: number;
	name: string;
	profile_path?: string;
}

export interface Movie {
	id: number;
	title: string;
	poster_path?: string;
	vote_average?: number;
	vote_count?: number;
	release_date?: string;
}

export async function getRandomActor(): Promise<Actor> {
	const res = await fetch(`${BASE_URL}/random-actor`);
	return res.json();
}

export async function getMoviesForActor(actorId: number): Promise<Movie[]> {
	const res = await fetch(`${BASE_URL}/movies/${actorId}`);
	return res.json();
}

export async function getActorsForMovie(movieId: number): Promise<Actor[]> {
	const res = await fetch(`${BASE_URL}/actors/${movieId}`);
	return res.json();
}
