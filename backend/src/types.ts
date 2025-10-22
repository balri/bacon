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
}
