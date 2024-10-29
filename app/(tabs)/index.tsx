import { View, StyleSheet } from 'react-native';
import Toast from 'react-native-root-toast';
import ImageViewer from "@/components/ImageViewer";
import Button from '@/components/Button';
import { ButtonTypes } from '@/types/ButtonTypes';

const PlaceholderImage = require('@/assets/images/test_image.jpg');

export default function Index() {

  const onButtonPressed = () => {
    console.log("onButtonPressed called");
  
    return Toast.show('Button pressed.', {
      duration: Toast.durations.LONG,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <ImageViewer imgSource={PlaceholderImage} />
      </View>
      <View style={styles.footerContainer}>
        <Button theme={ButtonTypes.PRIMARY} label="Choose a photo" onPress={() => onButtonPressed()} />
        <Button label="Use this photo" onPress={() => onButtonPressed()}/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: 'center',
  },
});
