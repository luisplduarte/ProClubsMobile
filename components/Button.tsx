import { StyleSheet, View, Pressable, Text, ViewStyle } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { ButtonTypes } from '../types/ButtonTypes'

type Props = {
  label: string;
  theme?: ButtonTypes;
  style?: ViewStyle;
  icon?: string;
  onPress: () => void;
};

export default function Button({ label, theme, style, icon, onPress }: Props) {
  const primaryStyles = theme === 'primary'
    ? { borderWidth: 4, borderColor: '#ffd33d', backgroundColor: '#fff' }
    : theme === 'logout' 
    ? { backgroundColor: '#ff5c5c' } : {};

  return (
    <View style={[styles.buttonContainer, primaryStyles, style]}>
      <Pressable style={[styles.button]} onPress={onPress}>
        {theme === 'primary' && (
          <FontAwesome name="picture-o" size={18} color="#25292e" style={styles.buttonIcon} />
        )}
         {theme === 'logout' && (
          <FontAwesome name="sign-out" size={18} color="#fff" style={styles.buttonIcon} />
        )}
        <Text style={[styles.buttonLabel, theme === 'primary' ? { color: '#25292e' } : {}]}>
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
    padding: 16,
    borderRadius: 18,
    margin: 4,
  },
  button: {
    borderRadius: 10,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonIcon: {
    paddingRight: 8,
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 16,
  },
});
