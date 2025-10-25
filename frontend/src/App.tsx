import { useEffect, useState } from "react";
import type { Actor as ActorType, Movie as MovieType } from "./api";
import { getRandomActor } from "./api";
import Actor from "./actors/Actor";
import Loading from "./utils/Loading";
import "./index.css";
import Movie from "./movies/Movie";
import Breadcrumbs from "./utils/Breadcrumbs";

export const KEVIN_BACON_ID = 4724;

function isActor(item: { type: string, data: any }): item is { type: "actor", data: ActorType } {
  return item.type === "actor";
}

function App() {
  const [stack, setStack] = useState<Array<{ type: "actor" | "movie", data: ActorType | MovieType }>>([]);
  const [loading, setLoading] = useState(true);
  const [endMessage, setEndMessage] = useState<null | React.ReactNode>(null);

  async function loadActor() {
    setLoading(true);
    const actor = await getRandomActor();
    if (actor) {
      setStack([{ type: "actor", data: actor }]);
      setEndMessage(null);
    }
    setLoading(false);
  }

  function handleMovieClick(movie: MovieType) {
    if (gameEnded) return;
    setStack(prev => [...prev, { type: "movie", data: movie }]);
  }

  function handleActorClick(actor: ActorType) {
    if (gameEnded) return;
    setStack(prev => [...prev, { type: "actor", data: actor }]);
  }

  function handleBack() {
    if (gameEnded) return;
    setStack(prev => prev.slice(0, -1));
  }

  useEffect(() => {
    loadActor();
    // eslint-disable-next-line
  }, []);

  // Find all actors in the stack
  const actorsInStack = stack.filter(isActor);

  // Game end logic
  const lastActor = actorsInStack[actorsInStack.length - 1];
  const reachedSixActors = actorsInStack.length === 6;
  const isKevinBacon = lastActor && lastActor.data.id === KEVIN_BACON_ID;
  const gameEnded = reachedSixActors || isKevinBacon || !!endMessage;

  // Breadcrumbs
  const breadcrumbs = (
    <Breadcrumbs stack={stack} onCrumbClick={index => !gameEnded && setStack(stack.slice(0, index + 1))} />
  );

  const current = stack[stack.length - 1];

  // Show full-screen overlay if game ended
  let overlay = null;
  if (reachedSixActors && !isKevinBacon) {
    overlay = (
      <div className="end-overlay">
        <div className="end-message">
          <span role="img" aria-label="sad">😢</span> Better luck next time!
        </div>
        <button className="random-actor-btn" onClick={loadActor}>
          🔀 Start Again
        </button>
      </div>
    );
  } else if (isKevinBacon) {
    overlay = (
      <div className="end-overlay">
        <div className="end-message">
          <span role="img" aria-label="trophy">🏆</span> Congratulations! You found Kevin Bacon!
        </div>
        <button className="random-actor-btn" onClick={loadActor}>
          🔀 Start Again
        </button>
      </div>
    );
  } else if (endMessage) {
    overlay = (
      <div className="end-overlay">
        <div className="end-message">{endMessage}</div>
        <button className="random-actor-btn" onClick={loadActor}>
          🔀 Start Again
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="app-container">
        <h1 className="main-title">🎬 Mmmm, Bacon 🥓</h1>
        <Loading />
      </div>
    );
  }

  if (overlay) {
    return (
      <div className="app-container">
        <h1 className="main-title">🎬 Mmmm, Bacon 🥓</h1>
        {overlay}
      </div>
    );
  }

  return (
    <div className="app-container">
      <h1 className="main-title">🎬 Mmmm, Bacon 🥓</h1>
      <div className="top-bar">
        <button className="random-actor-btn" onClick={loadActor}>
          🔀 Start Again
        </button>
        {stack.length > 1 && !gameEnded && (
          <button className="back-btn" onClick={handleBack}>
            ← Back
          </button>
        )}
      </div>
      {breadcrumbs}
      {current ? (
        !endMessage && current.type === "actor" ? (
          <Actor
            actor={current.data as ActorType}
            onMovieClick={handleMovieClick}
            stack={stack}
          />
        ) : (
          <Movie
            movie={current.data as MovieType}
            onActorClick={handleActorClick}
            stack={stack}
            onGameEnd={setEndMessage}
          />
        )
      ) : (
        <div className="error-message">❌ An error occurred. Please try again.</div>
      )}
      {gameEnded && overlay}
    </div>
  );
}

export default App;
