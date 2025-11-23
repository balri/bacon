import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

const cardStyle: ViewStyle = {
  alignItems: 'center',
  backgroundColor: '#eef2ff',
  borderRadius: 12,
  shadowColor: '#3730a3',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.07,
  shadowRadius: 8,
  elevation: 2,
  marginBottom: 16,
  padding: 16,
};

const errorContainerStyle: ViewStyle = {
  alignItems: 'center',
  padding: 16,
};

const errorTextStyle: TextStyle = {
  color: '#b91c1c',
  fontSize: 16,
  marginTop: 16,
  textAlign: 'center',
};

const imageStyle: ViewStyle = {
  minHeight: 130,
  alignItems: 'center',
  justifyContent: 'center',
};

const listItemStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: 10,
  paddingHorizontal: 16,
  borderBottomWidth: 1,
  borderBottomColor: '#e5e7eb',
  backgroundColor: '#fff',
};

const viewTitleStyle: TextStyle = {
  fontSize: 18,
  fontWeight: 'bold',
  marginVertical: 12,
  color: '#3730a3',
};

export const actorCardStyles = StyleSheet.create({
  card: cardStyle,
  name: {
    color: '#3730a3',
    fontSize: 22,
    fontWeight: '600',
    marginTop: 0,
    marginBottom: 0,
    textAlign: 'center',
  },
});

export const actorImageStyles = StyleSheet.create({
  container: imageStyle,
});

export const actorListStyles = StyleSheet.create({
  list: {
    paddingVertical: 8,
  },
  errorContainer: errorContainerStyle,
  errorText: errorTextStyle,
});

export const actorListItemStyles = StyleSheet.create({
  item: listItemStyle,
  textContainer: {
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3730a3',
  },
  character: {
    fontSize: 14,
    color: '#6366f1',
    fontStyle: 'italic',
  },
});

export const actorViewStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: viewTitleStyle,
  error: errorTextStyle,
});

export const baseImageStyles = StyleSheet.create({
  wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  img: {
    width: 120,
    height: 120,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  loaded: {
    opacity: 1,
  },
  thumbnail: {
    width: 60,
    height: 60,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 8,
  },
});

export const breadcrumbsStyles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    paddingVertical: 8,
  },
  item: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginBottom: 2,
  },
  actor: {
    backgroundColor: '#eef2ff',
    color: '#3730a3',
  },
  movie: {
    backgroundColor: '#fff7ed',
    color: 'f59e42',
  },
  text: {
    fontSize: 15,
    color: '#3730a3',
  },
});

export const endMessageStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#3730a3',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  playAgainBtn: {
    backgroundColor: '#6366f1',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  playAgainText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  backBtn: {
    backgroundColor: '#e0e7ff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  backText: {
    color: '#3730a3',
    fontWeight: '600',
    fontSize: 16,
  },
  endOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  endMessage: {
    backgroundColor: '#f1f5f9',
    padding: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  endMessageText: {
    fontSize: 18,
    color: '#3730a3',
    textAlign: 'center',
  },
});

export const introMessageStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#3730a3',
    marginBottom: 24,
  },
  overlay: {
    width: '100%',
    alignItems: 'center',
  },
  messageBox: {
    backgroundColor: '#eef2ff',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#3730a3',
    textAlign: 'center',
  },
  paragraph: {
    fontSize: 16,
    color: '#22223b',
    marginBottom: 20,
    textAlign: 'center',
  },
  bold: {
    fontWeight: 'bold',
    color: '#6366f1',
  },
  button: {
    backgroundColor: '#6366f1',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export const loadingStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  smallContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  tinyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  text: {
    marginTop: 12,
    fontSize: 18,
    color: '#6366f1',
  },
  smallText: {
    marginTop: 8,
    fontSize: 14,
    color: '#6366f1',
  },
  tinyText: {
    marginTop: 0,
    fontSize: 0,
    color: '#6366f1',
  },
});

export const movieCardStyles = StyleSheet.create({
  card: cardStyle,
  title: {
    color: '#1e293b',
    fontSize: 22,
    fontWeight: '600',
    marginTop: 0,
    marginBottom: 0,
    textAlign: 'center',
  },
  info: {
    fontSize: 16,
    color: '#6366f1',
    marginBottom: 2,
    textAlign: 'center',
  },
});

export const movieImageStyles = StyleSheet.create({
  container: imageStyle,
});

export const movieListStyles = StyleSheet.create({
  list: {
    paddingVertical: 8,
  },
  errorContainer: errorContainerStyle,
  errorText: errorTextStyle,
});

export const movieListItemStyles = StyleSheet.create({
  item: listItemStyle,
  meta: {
    marginLeft: 12,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3730a3',
  },
  year: {
    fontSize: 15,
    color: '#6366f1',
    marginLeft: 4,
  },
  rating: {
    fontSize: 15,
    color: '#f59e42',
    marginLeft: 4,
  },
});

export const movieViewStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: viewTitleStyle,
  errorMessage: errorTextStyle,
});

export const successMessageStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  image: {
    borderRadius: 8,
    width: 120,
    height: 180,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
    backgroundColor: '#eee',
  },
  messageBox: {
    alignItems: 'center',
  },
  trophy: {
    fontSize: 32,
    marginBottom: 4,
  },
  congrats: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#3730a3',
  },
  text: {
    fontSize: 16,
    color: '#22223b',
    textAlign: 'center',
    marginBottom: 4,
  },
  bold: {
    fontWeight: 'bold',
    color: '#6366f1',
  },
});

export const indexStyles = StyleSheet.create({
  appContainer: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#fff',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#3730a3',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  randomActorBtn: {
    backgroundColor: '#6366f1',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  backBtn: {
    backgroundColor: '#e0e7ff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  errorMessage: {
    color: '#b91c1c',
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
});
