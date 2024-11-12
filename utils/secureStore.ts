import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

/**
 * This file contains the methods for read and write operations in device local store
 */

/**
 * Creates or updates user's authentication data
 * @param token string with user's access token
 * @param userData object with user's information
 */
export async function saveUserData(token: string, userData: object) {
  try {
    const userPayload = JSON.stringify({ accessToken: token, userData });
    if (Platform.OS === 'web') {
      return await AsyncStorage.setItem('userSession', userPayload);
    } else {
      return await SecureStore.setItemAsync('userSession', userPayload);
    }
  } catch (error) {
    console.error("Error saving user data:", error);
  }
}

/**
 * Returns user's authentication data
 */
export async function getUserData() {
  try {
    let userPayload;
    if (Platform.OS === 'web') {
      userPayload = await AsyncStorage.getItem('userSession');
    } else {
      userPayload = await SecureStore.getItemAsync('userSession');
    }
    return userPayload ? JSON.parse(userPayload) : null;
  } catch (error) {
    console.error("Failed to fetch user data:", error);
  }
}

/**
 * Deletes user's authentication data from device local storage 
 */
export async function deleteUserData() {
  try {
    if (Platform.OS === 'web') {
      await AsyncStorage.removeItem('userSession');
    } else {
      await SecureStore.deleteItemAsync('userSession');
    }
  } catch (error) {
    console.error("Failed to delete user data:", error);
  }
}
