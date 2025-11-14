import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";

import type { Actor as ActorType, Movie as MovieType } from "../lib/api";
import { getRandomActor } from "../lib/api";
import ActorView from "./components/ActorView";
import Loading from "./components/Loading";
import MovieView from "./components/MovieView";
import Breadcrumbs from "./components/Breadcrumbs";
import EndMessage from "./components/EndMessage";
import IntroMessage from "./components/IntroMessage";

export const KEVIN_BACON_ID = 4724;
export const SIX_DEGREES = 6;

function isActor(item: {
  type: string;
  data: any;
}): item is { type: "actor"; data: ActorType } {
  return item.type === "actor";
}

export default function Index() {
  const [showIntro, setShowIntro] = useState(true);
  const [stack, setStack] = useState<
    Array<{ type: "actor" | "movie"; data: ActorType | MovieType }>
  >([]);
  const [loading, setLoading] = useState(true);
  const [endMessage, setEndMessage] = useState<null | {
    type: string;
    node: React.ReactNode;
  }>(null);

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
    setStack((prev) => [...prev, { type: "movie", data: movie }]);
  }

  function handleActorClick(actor: ActorType) {
    if (gameEnded) return;
    setStack((prev) => [...prev, { type: "actor", data: actor }]);
  }

  function handleBack() {
    setStack((prev) => prev.slice(0, -1));
    setEndMessage(null);
  }

  const actorsInStack = stack.filter(isActor);
  const lastActor = actorsInStack[actorsInStack.length - 1];
  const reachedSixActors = actorsInStack.length > SIX_DEGREES;
  const isKevinBacon = lastActor && lastActor.data.id === KEVIN_BACON_ID;
  const gameEnded = reachedSixActors || isKevinBacon || !!endMessage;

  const breadcrumbs = <Breadcrumbs stack={stack} />;

  const current = stack[stack.length - 1];

  if (showIntro) {
    return (
      <IntroMessage
        onStart={() => {
          setShowIntro(false);
          loadActor();
        }}
      />
    );
  }

  if (loading) {
    return (
      <View style={styles.appContainer}>
        <Text style={styles.mainTitle}>🎬 Mmmm, Bacon 🥓</Text>
        <Loading />
      </View>
    );
  }

  if (endMessage) {
    const isSuccess = endMessage.type === "success";
    return (
      <EndMessage
        endMessage={endMessage.node}
        loadActor={loadActor}
        handleBack={handleBack}
        breadcrumbs={breadcrumbs}
        showBackButton={!isSuccess}
      />
    );
  }

  return (
    <View style={styles.appContainer}>
      <Text style={styles.mainTitle}>🎬 Mmmm, Bacon 🥓</Text>
      <View style={styles.topBar}>
        <Pressable style={styles.randomActorBtn} onPress={loadActor}>
          <Text style={styles.buttonText}>🔀 Start Again</Text>
        </Pressable>
        {stack.length > 1 && !gameEnded && (
          <Pressable style={styles.backBtn} onPress={handleBack}>
            <Text style={styles.buttonText}>← Back</Text>
          </Pressable>
        )}
      </View>
      {breadcrumbs}
      {current ? (
        !endMessage && current.type === "actor" ? (
          <ActorView
            actor={current.data as ActorType}
            onMovieClick={handleMovieClick}
            stack={stack}
          />
        ) : (
          <MovieView
            movie={current.data as MovieType}
            onActorClick={handleActorClick}
            stack={stack}
            onGameEnd={setEndMessage}
          />
        )
      ) : (
        <Text style={styles.errorMessage}>
          ❌ An error occurred. Please try again.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#fff",
    alignItems: "stretch",
    justifyContent: "flex-start",
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
    color: "#3730a3",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  randomActorBtn: {
    backgroundColor: "#6366f1",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  backBtn: {
    backgroundColor: "#e0e7ff",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  errorMessage: {
    color: "#b91c1c",
    fontSize: 16,
    marginTop: 16,
    textAlign: "center",
  },
});
