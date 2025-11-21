import { View, Text } from 'react-native';
import type { Actor, Movie } from '@/lib/api';
import { breadcrumbsStyles } from '@/lib/styles';

interface BreadcrumbsProps {
  stack: { type: 'actor' | 'movie'; data: Actor | Movie }[];
}

export default function Breadcrumbs({ stack }: BreadcrumbsProps) {
  return (
    <View style={breadcrumbsStyles.container}>
      {stack.map((item, idx) => {
        const indent = idx * 6;
        const isActor = item.type === 'actor';
        const label = isActor
          ? (item.data as Actor).name
          : (item.data as Movie).title;

        const content = (
          <Text
            style={breadcrumbsStyles.text}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {label}
          </Text>
        );

        return (
          <View
            key={idx}
            style={[
              breadcrumbsStyles.item,
              isActor ? breadcrumbsStyles.actor : breadcrumbsStyles.movie,
              { marginLeft: indent, width: `100%` },
            ]}
          >
            {content}
          </View>
        );
      })}
    </View>
  );
}
