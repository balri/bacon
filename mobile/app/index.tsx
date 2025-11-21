import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';

import type { Actor as ActorType, Movie as MovieType } from '../lib/api';
import { getRandomActor } from '../lib/api';
import ActorView from './components/ActorView';
import Loading from './components/Loading';
import MovieView from './components/MovieView';
import Breadcrumbs from './components/Breadcrumbs';
import EndMessage from './components/EndMessage';
import IntroMessage from './components/IntroMessage';
import { KEVIN_BACON_ID, SIX_DEGREES } from '@/lib/config';
import { indexStyles } from '@/lib/styles';

function isActor(item: {
  type: string;
  data: any;
}): item is { type: 'actor'; data: ActorType } {
  return item.type === 'actor';
}

export default function Index() {
  const [showIntro, setShowIntro] = useState(true);
  const [stack, setStack] = useState<
    { type: 'actor' | 'movie'; data: ActorType | MovieType }[]
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
      setStack([{ type: 'actor', data: actor }]);
      setEndMessage(null);
    }
    setLoading(false);
  }

  function handleMovieClick(movie: MovieType) {
    if (gameEnded) return;
    setStack((prev) => [...prev, { type: 'movie', data: movie }]);
  }

  function handleActorClick(actor: ActorType) {
    if (gameEnded) return;
    setStack((prev) => [...prev, { type: 'actor', data: actor }]);
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
      <View style={indexStyles.appContainer}>
        <Text style={indexStyles.mainTitle}>🎬 Mmmm, Bacon 🥓</Text>
        <Loading />
      </View>
    );
  }

  if (endMessage) {
    const isSuccess = endMessage.type === 'success';
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
    <View style={indexStyles.appContainer}>
      <Text style={indexStyles.mainTitle}>🎬 Mmmm, Bacon 🥓</Text>
      <View style={indexStyles.topBar}>
        <Pressable style={indexStyles.randomActorBtn} onPress={loadActor}>
          <Text style={indexStyles.buttonText}>🔀 Start Again</Text>
        </Pressable>
        {stack.length > 1 && !gameEnded && (
          <Pressable style={indexStyles.backBtn} onPress={handleBack}>
            <Text style={indexStyles.buttonText}>← Back</Text>
          </Pressable>
        )}
      </View>
      {breadcrumbs}
      {current ? (
        !endMessage && current.type === 'actor' ? (
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
        <Text style={indexStyles.errorMessage}>
          ❌ An error occurred. Please try again.
        </Text>
      )}
    </View>
  );
}
