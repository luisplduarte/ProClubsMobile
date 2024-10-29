import { Stack, useRouter } from "expo-router";
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { setStatusBarStyle } from "expo-status-bar";
import { useEffect } from "react";
import * as SplashScreen from 'expo-splash-screen';
import { RootSiblingParent } from 'react-native-root-siblings';
import ProtectedRoute from '../components/ProtectedRoute';
import { useAuth } from '../hooks/useAuth';

const queryClient = new QueryClient();

// This is used to delay app initialization in order to test app's splash screen
// SplashScreen.preventAutoHideAsync();
// setTimeout(SplashScreen.hideAsync, 5000);

export default function RootLayout() {
  const user = useAuth();
  const router = useRouter();

  // Sets the status bar style to light when the app loads
  useEffect(() => {
    setTimeout(() => {
      setStatusBarStyle("dark");
    }, 0);
  }, []);

  useEffect(() => {
    if (!user) {
      router.replace('/login');
    }
  }, [user]);

  return (
    <GluestackUIProvider mode="light"><QueryClientProvider client={queryClient}>
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
  );
}
