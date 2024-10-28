import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: `${process.env.EXPO_PUBLIC_PROJECT_ID}.firebaseapp.com`,
    projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
    storageBucket: `${process.env.EXPO_PUBLIC_PROJECT_ID}.appspot.com`,
    // messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: process.env.EXPO_PUBLIC_APP_ID,
  };
  
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
