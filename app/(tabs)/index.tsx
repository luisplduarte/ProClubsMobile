import { View, StyleSheet, Text } from 'react-native';
import ImageViewer from "@/components/ImageViewer";
import Button from '@/components/Button';
import CustomToast from '@/components/CustomToast';
import { ToastTypes } from '@/types/ToastTypes';
import { sendNotificationToAll } from '@/api/notificationsService';

const PlaceholderImage = require('@/assets/images/splash.png');

export default function Index() {
  const handleSendNotification = async () => {
    //TODO change this to tanstack mutation
    try {
      const payload = {
        title: 'Nova mensagem!',
        body: 'Clique aqui para conferir.',
      };
  
      await sendNotificationToAll(payload);
  
      CustomToast({ 
        type: ToastTypes.SUCCESS, 
        title: 'Notificação enviada!',
        message: 'Todos os utilizadores foram notificados.'
      });

    } catch (error) {
      CustomToast({ 
        type: ToastTypes.ERROR, 
        title: 'Erro!',
        message: 'Não foi possível enviar a notificação.'
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Trio Mágico App</Text>
      <View style={styles.imageContainer}>
        <ImageViewer imgSource={PlaceholderImage} />
      </View>
      <Button
        label="Enviar Notificação"
        onPress={handleSendNotification}
      />
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
