import { StyleSheet, View, Pressable, Text, ViewStyle } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { ButtonTypes } from '../types/ButtonTypes'

type Props = {
  label: string;
  theme?: ButtonTypes;
  style?: ViewStyle;
  disabled?: boolean;
  onPress: () => void;
};

export default function Button({ label, theme, style, disabled, onPress }: Props) {
  const themeStyles = {
    primary: {
      container: { borderWidth: 4, borderColor: '#C02727', backgroundColor: '#fff' },
      label: { color: '#25292e' },
      icon: { name: 'picture-o' as 'picture-o', color: '#25292e' },
    },
    logout: {
      container: { backgroundColor: '#ff5c5c' },
      label: { color: '#fff' },
      icon: { name: 'sign-out' as 'sign-out', color: '#fff' },
    },
    default: {
      container: { backgroundColor: '#fff' },
      label: { color: '#25292e' },
    },
  }[theme || 'default'];

  return (
    <View style={[styles.buttonContainer, themeStyles.container, style]}>
      <Pressable style={styles.button} onPress={onPress} disabled={disabled}>
        { themeStyles.icon && <FontAwesome name={themeStyles.icon.name} size={18} color={themeStyles.icon.color}  style={styles.buttonIcon} /> }
        <Text style={[styles.buttonLabel, themeStyles.label]}>
          {label}
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    margin: 4,
  },
  button: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    padding: 14,
  },
  buttonIcon: {
    paddingRight: 8,
  },
  buttonLabel: {
    fontSize: 16,
  },
});
