import { useRouter } from "expo-router";
import Toast from 'react-native-root-toast';
import Button from '@/components/Button';
import { logOut } from '@/api/authService';
import { deleteAccessToken } from '../utils/secureStore';
import { ButtonTypes } from '@/types/ButtonTypes';

export default function LogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
      try {
        console.log("handleLogout called");
        await logOut();
        await deleteAccessToken();
        router.replace('/');
      } catch (error) {
        return Toast.show('Logout failed.', {
          duration: Toast.durations.LONG,
        });
      }
    };

    return (
      <Button label="LOGOUT" theme={ButtonTypes.LOGOUT} onPress={() => handleLogout()}/>
    )
};