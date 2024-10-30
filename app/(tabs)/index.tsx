import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import ImageViewer from "@/components/ImageViewer";

const PlaceholderImage = require('@/assets/images/splash.png');

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Trio Mágico App</Text>
      <View style={styles.imageContainer}>
        <ImageViewer imgSource={PlaceholderImage} />
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
    paddingBottom: 16,
  },
  headerText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    paddingBottom: 16,
  },
});
