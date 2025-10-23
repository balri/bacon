import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";
import cors from "cors";
import { Actor, Movie, movieFilter } from "./types";
import { getCache, setCache } from "./cache";
import rateLimit from "express-rate-limit";

dotenv.config();

const app = express();
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_KEY = process.env.TMDB_API_KEY!;
const PORT = process.env.PORT || 3000;

app.use(
	cors({
		origin: "*", // change to your frontend URL later, e.g. "http://localhost:5173"
	})
);

const limiter = rateLimit({
	windowMs: 60 * 1000,
	max: 60,
	message: {
		error: "Too many requests, please try again later.",
	},
});
app.use(limiter);

const asyncHandler =
	(fn: any) =>
		(req: Request, res: Response, next: NextFunction) =>
			Promise.resolve(fn(req, res, next)).catch(next);

app.get(
	"/api/random-actor",
	asyncHandler(async (_req: Request, res: Response) => {
		const page = Math.floor(Math.random() * 500);
		const cacheKey = "random-actor-page-" + page;
		const cached = getCache(cacheKey);
		if (cached) {
			const actor = cached[Math.floor(Math.random() * cached.length)];
			return res.json(actor);
		}

		const resp = await fetch(
			`${TMDB_BASE_URL}/person/popular?page=${page}&api_key=${TMDB_KEY}`
		);
		const data = await resp.json() as { results: Actor[] };

		const actors = data.results.filter(
			(a: Actor) =>
				a.profile_path &&
				a.known_for.filter(movieFilter).length >= 3
		);
		setCache(cacheKey, actors, 3600);
		console.log(`Page: ${page}, actors: ${actors.length}`);
		res.json(actors[Math.floor(Math.random() * actors.length)]);
	})
);

app.get(
	"/api/movies/:actorId",
	asyncHandler(async (req: Request, res: Response) => {
		const { actorId } = req.params;
		const cacheKey = `movies-${actorId}`;
		const cached = getCache(cacheKey);
		if (cached) return res.json(cached);

		const resp = await fetch(
			`${TMDB_BASE_URL}/person/${actorId}/movie_credits?api_key=${TMDB_KEY}`
		);
		const data = (await resp.json()) as { cast: Movie[] };
		const movies = data.cast.filter(movieFilter);
		setCache(cacheKey, movies, 3600);
		console.log(`ActorID: ${actorId}, movies: ${movies.length}`);
		res.json(movies);
	})
);

app.get(
	"/api/actors/:movieId",
	asyncHandler(async (req: Request, res: Response) => {
		const { movieId } = req.params;
		const cacheKey = `actors-${movieId}`;
		const cached = getCache(cacheKey);
		if (cached) return res.json(cached);

		const resp = await fetch(
			`${TMDB_BASE_URL}/movie/${movieId}/credits?api_key=${TMDB_KEY}`
		);
		const data = (await resp.json()) as { cast: Actor[] };
		setCache(cacheKey, data.cast, 3600);
		res.json(data.cast);
	})
);

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
	console.error("Error:", err);
	res.status(500).json({
		error: "Internal server error",
		message: err.message || "Something went wrong",
	});
});

app.listen(PORT, () =>
	console.log(`🎬 Server running on http://localhost:${PORT}`)
);
