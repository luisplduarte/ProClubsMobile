import { useEffect, useRef } from 'react';
import NetInfo from "@react-native-community/netinfo";
import { onlineManager } from "@tanstack/react-query";
import Toast from 'react-native-toast-message';

export const useNetwork = () => {
  // Track initial connection state to avoid showing modal on app launch
  const hasCheckedInitialConnection = useRef<boolean>(false);
  const lastConnectionState = useRef<boolean | null>(null); // Track the previous connection state to detect changes

  const handleMessage = (isConnected: boolean) => {
    onlineManager.setOnline(isConnected);

    if (hasCheckedInitialConnection.current) {
      Toast.show({
        type: isConnected ? 'success' : 'error',
        text1: isConnected ? 'Connection Restored' : 'Connection Lost',
        text2: isConnected ? 'You are back online!' : 'You have lost your internet connection.',
        position: 'top',
      });
    }
  };

  useEffect(() => {
    // First initial verification
    NetInfo.fetch().then(state => {
      const isConnected = !!state.isConnected;
      lastConnectionState.current = isConnected;
      hasCheckedInitialConnection.current = true; // Checks that first verification was done
    });

    const unsubscribe = NetInfo.addEventListener(state => {
      const isConnected = !!state.isConnected;

      if (hasCheckedInitialConnection.current && lastConnectionState.current !== isConnected) {
        handleMessage(isConnected);
        lastConnectionState.current = isConnected;
      }
    });

    return () => unsubscribe();
  }, []);
};
