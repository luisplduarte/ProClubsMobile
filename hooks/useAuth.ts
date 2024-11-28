import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../utils/firebaseConfig';
import { saveUserData, getUserData, deleteUserData } from '../utils/secureStore';

interface UserData {
  uid: string;
  email: string;
}

interface User {
  accessToken: string;
  userData: UserData;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthState = async () => {
      try {
        const cachedUser = await getUserData();
        if (cachedUser) {
          setUser(cachedUser);
          setIsLoading(false);
        } else {
          const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
              const token = await firebaseUser.getIdToken();

              const userData: UserData = {
                uid: firebaseUser.uid,
                email: firebaseUser.email || '',
              };

              const transformedUser: User = {
                accessToken: token,
                userData,
              };

              await saveUserData(token, transformedUser);
              setUser(transformedUser);
            } else {
              await deleteUserData();
              setUser(null);
            }
            setIsLoading(false);
          });

          return () => unsubscribe();
        }
      } catch (error) {
        console.error('Error retrieving cached user:', error);
        setIsLoading(false);
      }
    };

    checkAuthState();
  }, []);

  return { user, isLoading };
};
