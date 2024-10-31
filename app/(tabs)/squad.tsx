import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchClubPlayers } from '../../api/clubService';
import { ClubPlayersInfo, Player } from '@/types/PlayerTypes';


export default function Squad() {  
  const { data: clubPlayers, isLoading, error } = useQuery<ClubPlayersInfo, Error>(
    {
      queryKey: ['clubPlayers'],
      queryFn: () => fetchClubPlayers()
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
      {clubPlayers && 
        <View style={styles.container}>
          <Text style={styles.text}>Squad</Text>
          <Text style={styles.text}>TODO</Text>
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
