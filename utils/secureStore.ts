// src/utils/secureStore.js
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

/**
 * This file contains the methods for read and write operations in device local store
 */

/**
 * Creates or updates the value with 'accessToken' key
 * @param token string with user's accessToken
 */
export async function saveAccessToken(token: string) {
  try {
    if (Platform.OS === 'web') {
      return await AsyncStorage.setItem('accessToken', token);
    } else { // mobile
      return await SecureStore.setItemAsync('accessToken', token);
    }
  } catch (error) {
    console.error("Error saving data:", error); 
  }
}

/**
 * Returns user's accessToken
 */
export async function getAccessToken() {
  try {
    if (Platform.OS === 'web') {
      return await AsyncStorage.getItem('accessToken');
    } else { // mobile
      return await SecureStore.getItemAsync('accessToken');
    }
  } catch (error) {
    console.error("Failed to fetch access token:", error);
  }
}

/**
 * Deletes user's accessToken from device local storage 
 */
export async function deleteAccessToken() {
  try {
    if (Platform.OS === 'web') {
      await AsyncStorage.removeItem('accessToken');
    } else { // mobile
      await SecureStore.deleteItemAsync('accessToken');
    }
  } catch (error) {
    console.error("Failed to delete access token:", error);
  }
}
