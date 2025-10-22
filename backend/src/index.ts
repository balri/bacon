import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";
import cors from "cors";
import { Actor, Movie } from "./types";
import { getCache, setCache } from "./cache";
import rateLimit from "express-rate-limit";

dotenv.config();

const app = express();
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
	asyncHandler(async (_req, res) => {
		const cacheKey = "random-actor-page-" + Math.floor(Math.random() * 500);
		const cached = getCache(cacheKey);
		if (cached) {
			const actor = cached[Math.floor(Math.random() * cached.length)];
			return res.json(actor);
		}

		const page = Number(cacheKey.split("-").pop());
		const resp = await fetch(
			`https://api.themoviedb.org/3/person/popular?page=${page}&api_key=${TMDB_KEY}`
		);
		const data = await resp.json();
		setCache(cacheKey, data.results, 3600); // cache page for 1 hour
		const actor = data.results[Math.floor(Math.random() * data.results.length)];
		res.json(actor);
	})
);

// 🎬 Movies for actor
app.get(
	"/api/movies/:actorId",
	asyncHandler(async (req, res) => {
		const { actorId } = req.params;
		const cacheKey = `movies-${actorId}`;
		const cached = getCache(cacheKey);
		if (cached) return res.json(cached);

		const resp = await fetch(
			`https://api.themoviedb.org/3/person/${actorId}/movie_credits?api_key=${TMDB_KEY}`
		);
		const data = (await resp.json()) as { cast: Movie[] };
		setCache(cacheKey, data.cast, 3600);
		res.json(data.cast);
	})
);

// 🧑‍🤝‍🧑 Actors in movie
app.get(
	"/api/actors/:movieId",
	asyncHandler(async (req, res) => {
		const { movieId } = req.params;
		const cacheKey = `actors-${movieId}`;
		const cached = getCache(cacheKey);
		if (cached) return res.json(cached);

		const resp = await fetch(
			`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${TMDB_KEY}`
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
