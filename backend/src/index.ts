import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";
import cors from "cors";
import { Actor, TMDB_BASE_URL } from "./types";
import { getCache, setCache } from "./cache";
import rateLimit from "express-rate-limit";
import { movieCredits } from "./movieCredits";

dotenv.config();

const app = express();
export const TMDB_KEY = process.env.TMDB_API_KEY!;
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
		const MAX_RETRIES = 10;
		let retries = 0;

		while (retries < MAX_RETRIES) {
			const page = Math.floor(Math.random() * 500);
			const cacheKey = "random-actor-page-" + page;
			let data: { results: Actor[] };

			const cached = getCache(cacheKey);
			if (cached) {
				console.log(`Cached popular actors for page ${page}`);
				data = { results: cached };
			} else {
				console.log(`Uncached popular actors for page ${page}`);
				let resp;
				try {
					resp = await fetch(
						`${TMDB_BASE_URL}/person/popular?page=${page}&api_key=${TMDB_KEY}`
					);
				} catch (err) {
					console.error("Network error fetching TMDB:", err);
					return res.status(502).json({ error: "Failed to reach TMDB." });
				}
				if (!resp.ok) {
					const errorText = await resp.text();
					console.error("TMDB error:", resp.status, errorText);
					return res.status(resp.status).json({
						error: `TMDB error: ${resp.status}`,
						message: errorText,
					});
				}
				try {
					data = await resp.json() as { results: Actor[] };
				} catch (err) {
					console.error("Invalid JSON from TMDB:", err);
					return res.status(502).json({ error: "Invalid response from TMDB." });
				}
				setCache(cacheKey, data.results, 3600);
			}

			const shuffled = data.results.sort(() => 0.5 - Math.random());

			for (const person of shuffled) {
				if (!person.profile_path || person.known_for_department !== "Acting") {
					continue;
				}

				const movies = await movieCredits(person.id).then(movies => movies);
				if (movies.length > 0) {
					return res.json(person);
				}
			}

			retries++;
		}

		return res
			.status(404)
			.json({
				error: "No suitable actor found after several attempts.",
			});
	})
);

app.get(
	"/api/movies/:actorId",
	asyncHandler(async (req: Request, res: Response) => {
		const { actorId } = req.params;
		const movies = await movieCredits(Number(actorId)).then(movies => movies);
		res.json(movies);
	})
);

app.get(
	"/api/actors/:movieId",
	asyncHandler(async (req: Request, res: Response) => {
		const { movieId } = req.params;
		const cacheKey = `actors-${movieId}`;
		const cached = getCache(cacheKey);
		if (cached) {
			console.log(`Cached actors for movie ID: ${movieId}`);
			return res.json(cached);
		}

		console.log(`Uncached actors for movie ID: ${movieId}`);
		let resp;
		try {
			resp = await fetch(
				`${TMDB_BASE_URL}/movie/${movieId}/credits?api_key=${TMDB_KEY}`
			);
		} catch (error) {
			console.error("Network error fetching TMDB:", error);
			return res.status(502).json({ error: "Failed to reach TMDB." });
		}
		if (!resp.ok) {
			const errorText = await resp.text();
			console.error("TMDB error:", resp.status, errorText);
			return res.status(resp.status).json({
				error: `TMDB error: ${resp.status}`,
				message: errorText,
			});
		}
		let data: { cast: Actor[] };
		try {
			data = (await resp.json()) as { cast: Actor[] };
		} catch (error) {
			console.error("Invalid JSON from TMDB:", error);
			return res.status(502).json({ error: "Invalid response from TMDB." });
		}
		const actors = data.cast.filter(
			(a: Actor) =>
				a.profile_path &&
				a.known_for_department === "Acting"
		);
		setCache(cacheKey, actors, 3600);
		res.json(actors);
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
