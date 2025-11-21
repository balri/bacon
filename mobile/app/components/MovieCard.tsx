import { View, Text } from 'react-native';
import type { Movie } from '@/lib/api';
import MovieImage from './MovieImage';
import { movieCardStyles } from '@/lib/styles';

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <View style={movieCardStyles.card}>
      {movie.poster_path && <MovieImage movie={movie} />}
      <Text
        style={movieCardStyles.title}
        numberOfLines={2}
        ellipsizeMode="tail"
      >
        {movie.title}
      </Text>
      {movie.release_date && (
        <Text style={movieCardStyles.info}>
          Release year: {new Date(movie.release_date).getFullYear()}
        </Text>
      )}
      {movie.vote_average && (
        <Text style={movieCardStyles.info}>
          ⭐ {movie.vote_average.toFixed(1)}
        </Text>
      )}
    </View>
  );
}
