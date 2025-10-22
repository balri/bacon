export interface Actor {
	id: number;
	name: string;
	profile_path?: string;
	known_for: Movie[];
}

export interface Movie {
	id: number;
	title: string;
	poster_path?: string;
	vote_average: number;
	vote_count: number;
	media_type: string;
	original_language: string;
}
