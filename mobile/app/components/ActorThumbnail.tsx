import type { Actor } from '@/lib/api';
import BaseImage from './BaseImage';

interface ActorThumbnailProps {
  actor: Actor;
}

export default function ActorThumbnail({ actor }: ActorThumbnailProps) {
  if (!actor.profile_path) return null;
  return (
    <BaseImage
      url={`https://image.tmdb.org/t/p/w45${actor.profile_path}`}
      alt={actor.name}
      isThumbnail={true}
    />
  );
}
