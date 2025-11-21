import { View, Text, ActivityIndicator } from 'react-native';
import { loadingStyles } from '@/lib/styles';

interface LoadingProps {
  small?: boolean;
  tiny?: boolean;
}

export default function Loading({ small, tiny }: LoadingProps) {
  let containerStyle = loadingStyles.container;
  let spinnerSize: 'small' | 'large' = 'large';
  let textStyle = loadingStyles.text;
  let text = 'Loading...';

  if (tiny) {
    containerStyle = loadingStyles.tinyContainer;
    spinnerSize = 'small';
    textStyle = loadingStyles.tinyText;
    text = '';
  } else if (small) {
    containerStyle = loadingStyles.smallContainer;
    spinnerSize = 'small';
    textStyle = loadingStyles.smallText;
  }

  return (
    <View style={containerStyle}>
      <ActivityIndicator size={spinnerSize} color="#6366f1" />
      {text ? <Text style={textStyle}>{text}</Text> : null}
    </View>
  );
}
