import { useEffect, useState } from "react";
import type { Actor, Movie } from "./api";
import { getRandomActor, getMoviesForActor } from "./api";
import "./index.css";

function App() {
  const [actor, setActor] = useState<Actor | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadActor() {
      setLoading(true);
      const a = await getRandomActor();
      setActor(a);
      const m = await getMoviesForActor(a.id);
      setMovies(m);
      setLoading(false);
    }
    loadActor();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner" />
        <div className="loading-text">Loading...</div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <h1 className="main-title">🎬 Mmmm, Bacon 🥓</h1>
      {actor && (
        <div className="actor-card">
          {actor.profile_path && (
            <img
              src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
              alt={actor.name}
              className="actor-image"
            />
          )}
          <h2 className="actor-name">{actor.name}</h2>
        </div>
      )}

      <h3 className="movies-title">Select a movie:</h3>
      <ul className="movie-list">
        {movies.map((m) => (
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
        ))}
      </ul>
    </div>
  );
}

export default App;
