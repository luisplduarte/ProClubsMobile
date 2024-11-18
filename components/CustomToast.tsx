import Toast from 'react-native-toast-message';
import { ToastTypes } from '@/types/ToastTypes';

type Props = {
  type: ToastTypes;
  title: string;
  message: string;
};

export default function CustomToast({ type, title, message }: Props) {
  return (
    Toast.show({
        type: type,
        text1: title,
        text2: message,
        position: 'top',
        visibilityTime: 3000,
    })
  );
}