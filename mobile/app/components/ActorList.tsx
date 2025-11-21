import { View, Text, FlatList } from 'react-native';
import type { Actor } from '@/lib/api';
import ActorListItem from './ActorListItem';
import { actorListStyles } from '@/lib/styles';

interface ActorListProps {
  actors: Actor[];
  onActorClick: (actor: Actor) => void;
}

export default function ActorList({ actors, onActorClick }: ActorListProps) {
  if (!actors || actors.length === 0) {
    return (
      <View style={actorListStyles.errorContainer}>
        <Text style={actorListStyles.errorText}>
          ❌ No cast found for this movie.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={actors}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <ActorListItem actor={item} onActorClick={onActorClick} />
      )}
      contentContainerStyle={actorListStyles.list}
    />
  );
}
