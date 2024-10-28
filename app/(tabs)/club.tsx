import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchClubInfo } from '../../api/clubService';
import { ClubInfo as ClubInfoType } from '../../types/ClubInfoTypes';

export default function Club() {  
    const { data: clubData, isLoading, error } = useQuery<ClubInfoType, Error>(
        {
            queryKey: ['clubInfo'],
            queryFn: () => fetchClubInfo()
        }
    );
    
    if (isLoading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Data unavailable.</Text>
            </View>
        );
    }

  return (
    <View style={styles.container}>
        {clubData && 
            <View style={styles.container}>
                <Text style={styles.text}>Club name: {clubData.name}</Text>
                <Text style={styles.text}>Region id: {clubData.regionId}</Text>
            </View>
       }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});
