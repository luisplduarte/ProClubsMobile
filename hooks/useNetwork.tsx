import { useCallback, useEffect, useRef } from 'react';
import NetInfo from "@react-native-community/netinfo";
import { onlineManager } from "@tanstack/react-query";
import Toast from 'react-native-toast-message';

export const useNetwork = () => {
  // Track initial connection state to avoid showing modal on app launch
  const hasCheckedInitialConnection = useRef<boolean>(false);
  const lastConnectionState = useRef<boolean | null>(null); // Track the previous connection state to detect changes

  const handleMessage = useCallback((isConnected: boolean) => {
    onlineManager.setOnline(isConnected);
    Toast.show({
      type: isConnected ? 'success' : 'error',
      text1: isConnected ? 'Connection Restored' : 'Connection Lost',
      text2: isConnected ? 'You are back online!' : 'You have lost your internet connection.',
      position: 'top',
    });
  }, []);

  const checkInitialConnection = useCallback(async () => {
    const state = await NetInfo.fetch();
    const isConnected = !!state.isConnected;

    hasCheckedInitialConnection.current = true;
    lastConnectionState.current = isConnected;

    if (!isConnected) {
      handleMessage(false);
    }
  }, [handleMessage]);

  useEffect(() => {
    checkInitialConnection();

    const unsubscribe = NetInfo.addEventListener((state) => {
      const isConnected = !!state.isConnected;
      if ( hasCheckedInitialConnection.current && lastConnectionState.current !== isConnected ) {
        handleMessage(isConnected);
        lastConnectionState.current = isConnected;
      }
    });
    return () => unsubscribe();
  }, [checkInitialConnection, handleMessage]);

}