import { useEffect, useState } from "react";
import type { Actor as ActorType } from "./api";
import { getRandomActor } from "./api";
import Actor from "./Actor";
import Loading from "./Loading";
import "./index.css";

function App() {
  const [actor, setActor] = useState<ActorType | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadActor() {
    setLoading(true);
    const actor = await getRandomActor();
    setActor(actor);
    setLoading(false);
  }

  useEffect(() => {
    loadActor();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="app-container">
      <h1 className="main-title">🎬 Mmmm, Bacon 🥓</h1>
      <button className="random-actor-btn" onClick={loadActor}>
        🔀 Start Again
      </button>
      {actor ? (
        <Actor actor={actor} />
      ) : (
        <div className="error-message">
          ❌ No actor found. Please try again.
        </div>
      )}
    </div>
  );
}

export default App;
