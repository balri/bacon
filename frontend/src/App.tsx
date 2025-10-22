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

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Start with actor:</h1>
      {actor && (
        <div>
          <h2>{actor.name}</h2>
          {actor.profile_path && (
            <img
              src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
              alt={actor.name}
            />
          )}
        </div>
      )}

      <h3>Movies:</h3>
      <ul>
        {movies.map((m) => (
          <li key={m.id}>
            {m.title} {m.vote_average && `⭐ ${m.vote_average.toFixed(1)}`}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
