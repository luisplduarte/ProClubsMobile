import { auth } from '../utils/firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, AuthError } from 'firebase/auth';

export const signUp = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user.getIdToken();
  } catch (error) {
    const authError = error as AuthError;
    let errorMessage = "An unknown error occurred. Please try again.";
    if (authError.code == 'auth/email-already-in-use') {
      errorMessage = "This email is already in use. Please try logging in or use another email.";
    }
    throw new Error(errorMessage);
  }
};

export const logIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user.getIdToken();
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error during logout:", error);
    throw error;
  }
};
