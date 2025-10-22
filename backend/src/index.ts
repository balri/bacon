import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";
import cors from "cors";
import { Actor, Movie } from "./types";
import { getCache, setCache } from "./cache";
import rateLimit from "express-rate-limit";

dotenv.config();

const app = express();
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_KEY = process.env.TMDB_API_KEY!;
const PORT = process.env.PORT || 3000;

// Enable CORS for your frontend
app.use(
	cors({
		origin: "*", // change to your frontend URL later, e.g. "http://localhost:5173"
	})
);

// 🚦 Global rate limiter
const limiter = rateLimit({
	windowMs: 60 * 1000, // 1 minute
	max: 60, // limit each IP to 60 requests per minute
	message: {
		error: "Too many requests, please try again later.",
	},
});
app.use(limiter);

// Helper wrapper for async routes
const asyncHandler =
	(fn: any) =>
		(req: Request, res: Response, next: NextFunction) =>
			Promise.resolve(fn(req, res, next)).catch(next);

// 🧍 Random actor
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
		setCache(cacheKey, data.results, 3600); // cache page for 1 hour

		for (const actor of data.results.sort(() => Math.random() - 0.5)) {
			const creditsResp = await fetch(
				`${TMDB_BASE_URL}/person/${actor.id}/combined_credits?api_key=${TMDB_KEY}`
			);
			const creditsData = await creditsResp.json() as { cast: any[] };

			const movieCount = creditsData.cast.filter(
				(c: any) => c.media_type === "movie" && c.original_language === "en"
			).length;

			if (movieCount >= 5) {
				return res.json(actor);
			}
		}

		res.status(500).json({ error: "No suitable actor found" });
	})
);

// 🎬 Movies for actor
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
		setCache(cacheKey, data.cast, 3600);
		res.json(data.cast);
	})
);

// 🧑‍🤝‍🧑 Actors in movie
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

// 🎯 Centralized error handler
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
