import { useCallback, useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { actorViewStyles } from '@/lib/styles';

import { getMoviesForActor, type Actor, type Movie } from '@/lib/api';
import Loading from './Loading';
import MovieList from './MovieList';
import ActorCard from './ActorCard';

interface ActorProps {
  actor: Actor;
  onMovieClick: (movie: Movie) => void;
  stack: { type: 'actor' | 'movie'; data: Actor | Movie }[];
}

export default function ActorView({ actor, onMovieClick, stack }: ActorProps) {
  const [movies, setMovies] = useState<Movie[] | null>(null);
  const [loading, setLoading] = useState(true);

  const loadMovies = useCallback(async () => {
    setLoading(true);
    const movies = await getMoviesForActor(actor.id);
    setMovies(movies);
    setLoading(false);
  }, [actor.id]);

  useEffect(() => {
    loadMovies();
  }, [loadMovies]);

  if (loading) {
    return <Loading />;
  }

  const movieIdsInStack = stack
    .filter((item) => item.type === 'movie')
    .map((item) => (item.data as Movie).id);

  const filteredMovies = movies
    ? movies.filter((movie) => !movieIdsInStack.includes(movie.id))
    : [];

  return (
    <View style={actorViewStyles.container}>
      <ActorCard actor={actor} />
      <Text style={actorViewStyles.title}>Select a movie:</Text>
      {filteredMovies.length > 0 ? (
        <MovieList movies={filteredMovies} onMovieClick={onMovieClick} />
      ) : (
        <Text style={actorViewStyles.error}>
          ❌ No movies found for this actor.
        </Text>
      )}
    </View>
  );
}
