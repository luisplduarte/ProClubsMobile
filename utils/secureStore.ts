import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import * as Crypto from 'expo-crypto';
import { encode as base64Encode } from 'base-64';

/**
 * This file contains the methods for read and write operations in device local store
 */

/**
 * Generates a random key for encryption
 */
async function generateEncryptionKey(): Promise<string> {
  const randomBytes = await Crypto.getRandomBytesAsync(32); 
  return base64Encode(String.fromCharCode(...randomBytes));
}

/**
 * Encrypts the data using the key
 * @param data string to encrypt
 * @param key encryption key
 */
async function encryptData(data: string, key: string): Promise<string>  {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, data + key).then((digest) => digest);
}

/**
 * Decrypts the data using the key
 * @param encryptedData string to decrypt
 * @param key decryption key
 */
function decryptData(encryptedData: string, key: string): string {
  const bytes = CryptoJS.AES.decrypt(encryptedData, key);
  const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
  return decryptedData;
}

/**
 * Creates or updates user's authentication data
 * @param token string with user's access token
 * @param userData object with user's information
 */
export async function saveUserData(token: string, userData: object) {
  try {
    const userPayload = JSON.stringify({ accessToken: token, userData });

    if (Platform.OS === 'web') {
      return AsyncStorage.setItem('userSession', userPayload);
    }

    // Generate encryption key and save it securely
    const encryptionKey = await generateEncryptionKey();
    await SecureStore.setItemAsync('encryptionKey', encryptionKey);
 
    // Encrypt the user data
    const encryptedData = await encryptData(userPayload, encryptionKey);
 
    // Save the encrypted data to AsyncStorage
    await AsyncStorage.setItem('userSession', encryptedData);
  } catch (error) {
    console.error("Error saving user data:", error);
  }
}

/**
 * Returns user's authentication data
 */
export async function getUserData() {
  try {
    if (Platform.OS === 'web') {
      const userPayload = await AsyncStorage.getItem('userSession');
      return userPayload ? JSON.parse(userPayload) : null;
    }

    // Retrieve encryption key
    const encryptionKey = await SecureStore.getItemAsync('encryptionKey');
    if (!encryptionKey) {
      throw new Error('Encryption key not found');
    }

    // Get the encrypted data from AsyncStorage
    const encryptedData = await AsyncStorage.getItem('userSession');

    if (encryptedData) {
      // Decrypt the data
      const decryptedData = decryptData(encryptedData, encryptionKey);
      return decryptedData ? JSON.parse(decryptedData) : null;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Failed to fetch user data:", error);
  }
}

/**
 * Deletes user's authentication data from device local storage 
 */
export async function deleteUserData() {
  try {
    // Remove the encryption key and encrypted data
    if (Platform.OS !== 'web') {
      await SecureStore.deleteItemAsync('encryptionKey');
    }
    await AsyncStorage.removeItem('userSession');
  } catch (error) {
    console.error("Failed to delete user data:", error);
  }
}
