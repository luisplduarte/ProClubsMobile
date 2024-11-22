import { ActivityIndicator } from 'react-native';
import { Stack, useRouter } from "expo-router";
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { setStatusBarStyle } from "expo-status-bar";
import { useEffect } from "react";
import { RootSiblingParent } from 'react-native-root-siblings';
import Toast from 'react-native-toast-message';
import * as Notifications from 'expo-notifications';
import { useAuth } from '../hooks/useAuth';
import { useNetwork } from "@/hooks/useNetwork";
import CustomToast from '@/components/CustomToast';
import { ToastTypes } from '@/types/ToastTypes';

const queryClient = new QueryClient();

// This is used to delay app initialization in order to test app's splash screen
// import * as SplashScreen from 'expo-splash-screen';
// SplashScreen.preventAutoHideAsync();
// setTimeout(SplashScreen.hideAsync, 5000);

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function RootLayout() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  useNetwork();

  // Sets the status bar style when app loads
  useEffect(() => {
    setTimeout(() => {
      setStatusBarStyle("dark");
    }, 0);
  }, []);

  useEffect(() => {
    if (!isLoading && !user) router.replace('/login');
  }, [user, isLoading]);

  // Listener for incoming notifications
  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
      CustomToast({
        type: ToastTypes.SUCCESS,
        title: 'New notification!',
        message: notification.request.content.body || "",
      })
    });

    return () => {
      subscription.remove();
    };
  }, []);

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <>
      <GluestackUIProvider mode="light">
        <QueryClientProvider client={queryClient}>
          <RootSiblingParent>
            <Stack>
              <Stack.Screen name="login" />
              <Stack.Screen name="signup" />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
            </Stack>
          </RootSiblingParent>
        </QueryClientProvider>
      </GluestackUIProvider>
      <Toast />
    </>
  );
}
