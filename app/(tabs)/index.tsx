import { View, StyleSheet, Text } from 'react-native';
import { useMutation } from '@tanstack/react-query';
import ImageViewer from "@/components/ImageViewer";
import Button from '@/components/Button';
import CustomToast from '@/components/CustomToast';
import { ToastTypes } from '@/types/ToastTypes';
import { NotificationPayload } from '@/types/NotificationTypes';
import { sendNotificationToAll } from '@/api/notificationsService';

const PlaceholderImage = require('@/assets/images/splash.png');

export default function Index() {
  const sendNotificationMutation = useMutation({
    mutationFn: ( payload: NotificationPayload ) => sendNotificationToAll(payload),
    onSuccess: () => {
      CustomToast({ 
        type: ToastTypes.SUCCESS, 
        title: 'Notification sent!',
        message: 'All users were notified.'
      });
    },
    onError: () => {
      CustomToast({ 
        type: ToastTypes.ERROR, 
        title: 'Action Failed', 
        message: 'An error occurred while notifying users.'
      });
    },
  });

  const handleSendNotification = async () => {
    const payload: NotificationPayload = {
      title: 'Treino!',
      body: 'Pro clubs às 22h.',
    };

    sendNotificationMutation.mutate(payload);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Trio Mágico App</Text>
      <View style={styles.imageContainer}>
        <ImageViewer imgSource={PlaceholderImage} />
      </View>
      <Button
        label="Notify players"
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
