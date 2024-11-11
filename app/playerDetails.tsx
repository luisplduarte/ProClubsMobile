import { View, StyleSheet, Text, ScrollView, ActivityIndicator } from 'react-native';
import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { fetchPlayerByName } from '../api/clubService';
import { Player } from '@/types/PlayerTypes';
import { VStack } from '@/components/ui/vstack';
import CardLayout from '@/components/cards/CardLayout';

export default function PlayerDetails() {
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const playerName = Array.isArray(params.name) ? params.name[0] : params?.name || '';
  
  const { data: playerInfo, isLoading, error } = useQuery<Player, Error>(
    {
      queryKey: ['playerInfo', playerName],
      queryFn: () => fetchPlayerByName(playerName),
      enabled: !!playerName,
    }
  );

  useEffect(() => {
    // This will change page name to player's name
    if (playerName) navigation.setOptions({ title: `${playerName}` });
  }, [navigation, playerName]);

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
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {playerInfo && 
          <>
            <Text style={styles.text}>{playerInfo.name} stats</Text>
            <VStack space="lg" style={styles.vStackContainer}>
              <CardLayout>
                <View style={styles.row}>
                  <Text style={styles.playerDetails}>Character name:</Text>
                  <Text style={styles.playerStat}>{playerInfo.proName}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.playerDetails}>Position:</Text>
                  <Text style={styles.playerStat}>{playerInfo.proPos}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.playerDetails}>Favorite position:</Text>
                  <Text style={styles.playerStat}>{playerInfo.favoritePosition}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.playerDetails}>Overall:</Text>
                  <Text style={styles.playerStat}>{playerInfo.proOverall}</Text>
                </View>
                <View style={styles.row}>
                  {/* TODO: map nationality number to country */}
                  <Text style={styles.playerDetails}>Nationality:</Text>
                  <Text style={styles.playerStat}>{playerInfo.proNationality}</Text>
                </View>
                <View style={styles.row}>
                  {/* TODO: map height in cms string to meters and cms */}
                  <Text style={styles.playerDetails}>Player height:</Text>
                  <Text style={styles.playerStat}>{playerInfo.proHeight}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.playerDetails}>Games played:</Text>
                  <Text style={styles.playerStat}>{playerInfo.gamesPlayed}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.playerDetails}>MOTM:</Text>
                  <Text style={styles.playerStat}>{playerInfo.manOfTheMatch}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.playerDetails}>Goals:</Text>
                  <Text style={styles.playerStat}>{playerInfo.goals}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.playerDetails}>Assists:</Text>
                  <Text style={styles.playerStat}>{playerInfo.assists}</Text>
                </View>
                {/* TODO: create goals + assists field in the backend */}
                <View style={styles.row}>
                  <Text style={styles.playerDetails}>Average rating:</Text>
                  <Text style={styles.playerStat}>{playerInfo.ratingAve}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.playerDetails}>Shot success rate:</Text>
                  <Text style={styles.playerStat}>{playerInfo.shotSuccessRate}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.playerDetails}>Passes made:</Text>
                  <Text style={styles.playerStat}>{playerInfo.passesMade}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.playerDetails}>Pass success rate:</Text>
                  <Text style={styles.playerStat}>{playerInfo.passSuccessRate}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.playerDetails}>Tackles made:</Text>
                  <Text style={styles.playerStat}>{playerInfo.tacklesMade}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.playerDetails}>Tackle success rate:</Text>
                  <Text style={styles.playerStat}>{playerInfo.tackleSuccessRate}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.playerDetails}>Clean sheets as defender:</Text>
                  <Text style={styles.playerStat}>{playerInfo.cleanSheetsDef}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.playerDetails}>Clean sheets as GK:</Text>
                  <Text style={styles.playerStat}>{playerInfo.cleanSheetsGK}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.playerDetails}>Red cards:</Text>
                  <Text style={styles.playerStat}>{playerInfo.redCards}</Text>
                </View>  
              </CardLayout>
            </VStack>
          </>
        }
      </ScrollView> 
    </View>
  );
}

const styles = StyleSheet.create({
  vStackContainer: {
    width: '85%',
  },
  container: {
    flex: 1,
    backgroundColor: '#25292e',
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
    fontSize: 20,
    color: '#ffffff',
  },
  playerStat: {
    fontSize: 20,
    color: '#ffffff',
    textAlign: 'right',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
});
