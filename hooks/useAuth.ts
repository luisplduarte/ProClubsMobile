import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../utils/firebaseConfig'
import { saveUserData, getUserData, deleteUserData } from '../utils/secureStore';

export const useAuth = () => {
  const [user, setUser] = useState<object | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken()
        await saveUserData(token, firebaseUser);
        setUser(firebaseUser);
      } else {
        await deleteUserData();
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const checkCachedUser = async () => {
      try {
        const cachedUser = await getUserData();
        if (cachedUser) setUser(cachedUser);
        setIsLoading(false);
      } catch (error) {
        console.error('Error retrieving cached user:', error);
        setIsLoading(false);
      }
    };

    checkCachedUser();
  }, [])

  return { user, isLoading };
};
