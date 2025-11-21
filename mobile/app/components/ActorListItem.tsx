import { View, Text, Pressable } from 'react-native';
import type { Actor } from '@/lib/api';
import ActorThumbnail from './ActorThumbnail';
import { actorListItemStyles } from '@/lib/styles';

interface ActorListItemProps {
  actor: Actor;
  onActorClick: (actor: Actor) => void;
}

export default function ActorListItem({
  actor,
  onActorClick,
}: ActorListItemProps) {
  return (
    <Pressable
      style={actorListItemStyles.item}
      onPress={() => onActorClick(actor)}
    >
      {actor.profile_path && <ActorThumbnail actor={actor} />}
      <View style={actorListItemStyles.textContainer}>
        <Text style={actorListItemStyles.name}>{actor.name}</Text>
        {actor.character && (
          <Text style={actorListItemStyles.character}>
            as {actor.character}
          </Text>
        )}
      </View>
    </Pressable>
  );
}
