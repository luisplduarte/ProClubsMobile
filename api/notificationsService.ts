import { collection, addDoc, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { db } from '@/utils/firebaseConfig';
import { NotificationPayload } from '@/types/NotificationTypes';

/**
 * Function to register for push notifications
 * @returns 
 */
export const registerForPushNotificationsAsync = async (): Promise<string | null> => {
    try {
        if (!Device.isDevice) {
            console.log('Push notifications are not supported on emulators.');
            return null;
        }

        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') return null;
        
        return (await Notifications.getExpoPushTokenAsync({projectId: process.env.EXPO_PUBLIC_PROJECT_ID})).data;
    } catch (error) {
        console.error('Error registering push token:', error);
        throw new Error('Failed to register push token.');
    }
};

/**
 * Registers a user's Expo Push Token in the Firestore database.
 * @param userId The ID of the user.
 * @param expoPushToken The Expo Push Token to be stored.
 */
export const registerPushToken = async (userId: string, expoPushToken: string) => {
  try {
    // Check if token is already registered for user
    const tokenQuery = query(
      collection(db, 'pushTokens'),
      where('userId', '==', userId)
    );

    const existingTokens = await getDocs(tokenQuery);
    if (existingTokens.empty) {
      // Create new push token
      await addDoc(collection(db, 'pushTokens'), {
        userId,
        expoPushToken,
        createdAt: new Date().toISOString(),
      });
    }

  } catch (error) {
    console.error('Error registering push token:', error);
    throw new Error('Failed to register push token.');
  }
};

/**
 * Removes a user's Expo Push Token from the Firestore database.
 * @param userId The ID of the user whose token should be removed.
 */
export const removePushToken = async (userId: string) => {
  try {
    const tokenQuery = query(
      collection(db, 'pushTokens'),
      where('userId', '==', userId)
    );
    const tokensSnapshot = await getDocs(tokenQuery);

    tokensSnapshot.forEach(async (tokenDoc) => {
      await deleteDoc(doc(db, 'pushTokens', tokenDoc.id));
    });

  } catch (error) {
    console.error('Error removing push token:', error);
    throw new Error('Failed to remove push token.');
  }
};

/**
 * Fetches all registered Expo Push Tokens from the Firestore database.
 * @returns An array of Expo Push Tokens.
 */
export const fetchAllPushTokens = async (): Promise<string[]> => {
  try {
    const snapshot = await getDocs(collection(db, 'pushTokens'));
    const tokens: string[] = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      tokens.push(data.expoPushToken);
    });

    return tokens;
  } catch (error) {
    console.error('Error fetching push tokens:', error);
    throw new Error('Failed to fetch push tokens.');
  }
};

/**
 * Sends a push notification to all registered users.
 * @param payload The notification title and body to be sent.
 */
export const sendNotificationToAll = async (payload: NotificationPayload) => {
    try {
      const tokens = await fetchAllPushTokens();
      if (tokens.length === 0) return;

      const messages = tokens.map((token) => ({
        to: token,
        sound: 'default',
        title: payload.title,
        body: payload.body,
        data: { customData: 'example' },
      }));
  
      const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${process.env.EXPO_PUBLIC_ACCESS_TOKEN}`,
        },
        body: JSON.stringify(messages),
      });
  
      if (!response.ok) {
        const error = await response.json();
        console.error('Error sending push notifications:', error);
        throw new Error('Failed to send push notifications.');
      }
  
      return response.json();
    } catch (error) {
      console.error('Error sending push notification to all:', error);
      throw new Error('Failed to send push notification to all.');
    }
};
