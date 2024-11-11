import { View, StyleSheet, Text, ActivityIndicator, Dimensions, ScrollView } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { fetchClubPlayers } from '../../api/clubService';
import { ClubPlayersInfo } from '@/types/PlayerTypes';
import { VStack } from '@/components/ui/vstack';
import CardLayout from '@/components/cards/CardLayout';

const { width: screenWidth } = Dimensions.get('window');

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
          <Text style={styles.text}>Forwards ({clubPlayers?.positionCount.forward})</Text>
          <View style={styles.wrapContainer}>
            {forwards.length ? 
              forwards.map((player) => {
                  return (
                    <CardLayout style={styles.card} onClick={() => onPlayerClicked(player.name)}>
                      <View>
                        <Text style={styles.text}>{player.name}</Text>
                        <Text style={styles.playerDetails}>Goals: {player.goals}</Text>
                        <Text style={styles.playerDetails}>Assists: {player.assists}</Text>
                        <Text style={styles.playerDetails}>Average rating: {player.ratingAve}</Text>
                      </View>
                    </CardLayout>
                  )
              }) : 
              <Text style={styles.playerDetails}>No forwards in the club</Text>
            }
          </View>

          <Text style={styles.text}>Midfielders ({clubPlayers?.positionCount.midfielder})</Text>
          <View style={styles.wrapContainer}>
            {midfielders.length ? 
              midfielders.map((player) => {
                return (
                  <CardLayout style={styles.card} onClick={() => onPlayerClicked(player.name)}>
                    <View>
                      <Text style={styles.text}>{player.name}</Text>
                      <Text style={styles.playerDetails}>Goals: {player.goals}</Text>
                      <Text style={styles.playerDetails}>Assists: {player.assists}</Text>
                      <Text style={styles.playerDetails}>Average rating: {player.ratingAve}</Text>
                    </View>
                  </CardLayout>
                )
              }) : 
              <Text style={styles.playerDetails}>No midfielders in the club</Text>
            }
          </View>

          <Text style={styles.text}>Defenders ({clubPlayers?.positionCount.defender})</Text>
          <View style={styles.wrapContainer}>
            {defenders.length ? 
              defenders.map((player) => {
                return (
                  <CardLayout style={styles.card} onClick={() => onPlayerClicked(player.name)}>
                    <View>
                      <Text style={styles.text}>{player.name}</Text>
                      <Text style={styles.playerDetails}>Goals: {player.goals}</Text>
                      <Text style={styles.playerDetails}>Assists: {player.assists}</Text>
                      <Text style={styles.playerDetails}>Average rating: {player.ratingAve}</Text>
                    </View>
                  </CardLayout>
                )
              }) : 
              <Text style={styles.playerDetails}>No defenders in the club</Text>
            }
          </View>

          <Text style={styles.text}>Goalkeepers ({clubPlayers?.positionCount.goalkeeper})</Text>
          <View style={styles.wrapContainer}>
            {goalkeepers.length ? 
              goalkeepers.map((player) => {
                return (
                  <CardLayout style={styles.card} onClick={() => onPlayerClicked(player.name)}>
                    <View>
                      <Text style={styles.text}>{player.name}</Text>
                      <Text style={styles.playerDetails}>Goals: {player.goals}</Text>
                      <Text style={styles.playerDetails}>Assists: {player.assists}</Text>
                      <Text style={styles.playerDetails}>Average rating: {player.ratingAve}</Text>
                    </View>
                  </CardLayout>
                )
              }) : 
              <Text style={styles.playerDetails}>No goalkeepers in the club</Text>
            }
          </View>
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
  playerDetails: {
    fontSize: 16,
    color: '#ffffff',
  },
  wrapContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    // justifyContent: 'flex-start',    //If I use this, then there's no margin to the left of the screen
    gap: 8,
  },
  card: {
    width: screenWidth / 2 - 16,
    backgroundColor: '#646466',
    padding: 8,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#ffffff',
    marginBottom: 8,
  },
});
