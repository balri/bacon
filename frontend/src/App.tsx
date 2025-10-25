import { useEffect, useState } from "react";
import type { Actor as ActorType, Movie as MovieType } from "./api";
import { getRandomActor } from "./api";
import Actor from "./actors/Actor";
import Loading from "./utils/Loading";
import "./index.css";
import Movie from "./movies/Movie";
import Breadcrumbs from "./utils/Breadcrumbs";

function App() {
  const [actor, setActor] = useState<ActorType | null>(null);
  const [loading, setLoading] = useState(true);
  const [movie, setMovie] = useState<MovieType | null>(null);

  async function loadActor() {
    setLoading(true);
    setMovie(null);
    const actor = await getRandomActor();
    setActor(actor);
    setLoading(false);
  }

  async function handleMovieClick(movie: MovieType) {
    setMovie(movie);
  }

  async function handleActorClick(actor: ActorType) {
    setMovie(null);
    setActor(actor);
  }

  function handleBack() {
    setMovie(null);
  }

  useEffect(() => {
    loadActor();
  }, []);

  // Breadcrumbs
  const breadcrumbs = (
    <Breadcrumbs actor={actor!} movie={movie!} />
  );

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="app-container">
      <h1 className="main-title">🎬 Mmmm, Bacon 🥓</h1>
      <div className="top-bar">
        <button className="random-actor-btn" onClick={loadActor}>
          🔀 Start Again
        </button>
        {movie && actor && (
          <button className="back-btn" onClick={handleBack}>
            ← Back to {actor.name}
          </button>
        )}
      </div>
      {breadcrumbs}
      {actor ? (
        movie ? (
          <Movie movie={movie} onActorClick={handleActorClick} />
        ) : (
          <Actor actor={actor} onMovieClick={handleMovieClick} />
        )
      ) : (
        <div className="error-message">
          ❌ No actor found. Please try again.
        </div>
      )}
    </div>
  );
}

export default App;
