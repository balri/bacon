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
	media_type?: string;
	original_language: string;
	adult: boolean;
	popularity: number;
	genre_ids: number[];
	release_date?: string;
}

const GENRE_ID_DOCUMENTARY = 99;
const GENRE_ID_MUSIC = 10402;
const GENRE_ID_NEWS = 10763;
const GENRE_ID_REALITY = 10764;
const GENRE_ID_TV_MOVIE = 10770;
const MEDIA_TYPE_MOVIE = "movie";
const LANGUAGE_ENGLISH = "en";

const EXCLUDED_GENRE_IDS = [
	GENRE_ID_DOCUMENTARY,
	GENRE_ID_MUSIC,
	GENRE_ID_NEWS,
	GENRE_ID_REALITY,
	GENRE_ID_TV_MOVIE,
];

export const movieFilter = (m: Movie) =>
	!m.adult &&
	(!m.media_type || m.media_type === MEDIA_TYPE_MOVIE) &&
	m.original_language === LANGUAGE_ENGLISH &&
	m.genre_ids.length > 0 &&
	!!m.release_date &&
	m.genre_ids.every((id) => !EXCLUDED_GENRE_IDS.includes(id)) &&
	m.vote_average > 0 &&
	m.vote_count > 0;
