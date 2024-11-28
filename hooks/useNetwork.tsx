import { useEffect, useRef } from 'react';
import NetInfo from "@react-native-community/netinfo";
import { onlineManager } from "@tanstack/react-query";
import CustomToast from '@/components/CustomToast';
import { ToastTypes } from '@/types/ToastTypes';

export const useNetwork = () => {
  const hasCheckedInitialConnection = useRef<boolean>(false); // Track initial connection state to avoid showing modal on app launch
  const lastConnectionState = useRef<boolean | null>(null); // Track the previous connection state to detect changes

  const handleMessage = (isConnected: boolean) => {
    onlineManager.setOnline(isConnected);

    if (hasCheckedInitialConnection.current) {
      CustomToast({ 
        type: isConnected ? ToastTypes.SUCCESS : ToastTypes.ERROR, 
        title: isConnected ? 'Connection Restored' : 'Connection Lost', 
        message: isConnected ? 'You are back online!' : 'You have lost your internet connection.'
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

  return 
};
