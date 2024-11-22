import { View, StyleSheet, Text, ActivityIndicator, ScrollView } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { fetchClubPlayers } from '../../api/clubService';
import { ClubPlayersInfo } from '@/types/PlayerTypes';
import { VStack } from '@/components/ui/vstack';
import PlayersByPosition from '@/components/PlayersByPosition';

export default function Squad() {
  const router = useRouter();
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

  const onPlayerClicked = (playerName: string) => {
    router.push(`/playerDetails?name=${playerName}`);
  }

  const forwards = clubPlayers?.members.filter((player) => player.favoritePosition === 'forward' ) || [];
  const midfielders = clubPlayers?.members.filter((player) => player.favoritePosition === 'midfielder' ) || [];
  const defenders = clubPlayers?.members.filter((player) => player.favoritePosition === 'defender' ) || [];
  const goalkeepers = clubPlayers?.members.filter((player) => player.favoritePosition === 'goalkeeper' ) || [];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.text}>Squad list</Text>
        <VStack>
          <PlayersByPosition players={forwards} position='forwards' onPress={(e) => onPlayerClicked(e)} />
          <PlayersByPosition players={midfielders} position='midfielders' onPress={(e) => onPlayerClicked(e)} />
          <PlayersByPosition players={defenders} position='defenders' onPress={(e) => onPlayerClicked(e)} />
          <PlayersByPosition players={goalkeepers} position='goalkeepers' onPress={(e) => onPlayerClicked(e)} />
        </VStack>
      </ScrollView> 
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
  scrollContainer: {
    paddingBottom: 24,
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
    textAlign: 'center',
    marginBottom: 8,
  },
});
