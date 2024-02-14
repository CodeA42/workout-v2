import { View } from 'react-native';
import { StyleSheet } from 'react-native';
import { theme } from './theme';

export const Separator = () => {
  return <View style={styles.separator} />;
};

const styles = StyleSheet.create({
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: theme.colors.border,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
});
