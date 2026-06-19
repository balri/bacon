export const KEVIN_BACON_ID = 4724;
export const SIX_DEGREES = 6;

export interface Actor {
	id: number;
	name: string;
	character?: string;
	profile_path?: string;
	bacon_number?: number;
	game_number?: number;
}

export interface Movie {
	id: number;
	title: string;
	poster_path?: string;
	vote_average?: number;
	vote_count?: number;
	release_date?: string;
}
