import React, { useState } from 'react';
import { View, StyleSheet, Text, Modal, Pressable  } from 'react-native';
import { useMutation } from '@tanstack/react-query';
import DateTimePicker from '@react-native-community/datetimepicker';
import ImageViewer from "@/components/ImageViewer";
import CustomToast from '@/components/CustomToast';
import { ToastTypes } from '@/types/ToastTypes';
import { NotificationPayload } from '@/types/NotificationTypes';
import { sendNotificationToAll } from '@/api/notificationsService';

const PlaceholderImage = require('@/assets/images/splash.png');

export default function Index() {
  const [modalVisible, setModalVisible] = useState(false);
  const [timePickerVisible, setTimePickerVisible] = useState(false);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);

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

  const handleSendNotification = () => {
    if (!selectedTime) return;

    const formattedTime = selectedTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    const payload: NotificationPayload = {
      title: 'Treino!',
      body: `Pro clubs às ${formattedTime}.`,
    };

    sendNotificationMutation.mutate(payload);
    cleanUp();
  };

  const handleTimeChange = (event: any, selected: Date | undefined) => {
    if (event.type === "set" && selected) setSelectedTime(selected);
    setTimePickerVisible(false);
  };

  const getTimeString = () => {
    return selectedTime ? 
      selectedTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit'})
      : 'Select a time';
  };

  const cleanUp = () => {
    setModalVisible(false);
    setSelectedTime(null);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Trio Mágico App</Text>
      <View style={styles.imageContainer}>
        <ImageViewer imgSource={PlaceholderImage} />
      </View>
      
      <Pressable onPress={() => setModalVisible(true)} style={{ margin: 8, borderWidth: 1, borderColor: '#ffffff', padding: 16, borderRadius: 8 }}>
        <Text style={styles.text}>Notify players</Text>
      </Pressable>

      {/* Modal for selecting time */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => cleanUp()}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeaderText}>Set training time</Text>
            <Pressable onPress={() => setTimePickerVisible(true)} style={styles.timeInput}>
              <Text style={styles.text}>{getTimeString()}</Text>
            </Pressable>

            {timePickerVisible && 
              <DateTimePicker
                value={selectedTime || new Date()}
                mode="time"
                display="default"
                onChange={handleTimeChange}
              />
            }

            <Text style={styles.text}>Set training time to be sent in the notification to all users</Text>
            
            <View style={styles.modalButtons}>
              <Pressable onPress={() => cleanUp()} style={{ margin: 8, borderWidth: 1, borderColor: '#ffffff', padding: 16, borderRadius: 8 }}>
                <Text style={styles.text}>Cancel</Text>
              </Pressable>
              <Pressable onPress={() => handleSendNotification()} style={{ margin: 8, backgroundColor: '#C02727', padding: 16, borderRadius: 8 }}>
                <Text style={styles.text}>Submit</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    width: '80%',
    //height: '50%',
    backgroundColor: '#646466',
    borderWidth: 1,
    borderColor: '#ffffff',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
  },
  modalHeaderText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#ffffff'
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: 16,
  },
  timeInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
  },
});
