import { View, StyleSheet, Text, ScrollView, ActivityIndicator } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { fetchClubInfo } from '../api/clubService';
import { ClubInfo as ClubInfoType } from '../types/ClubInfoTypes';
import { VStack } from '@/components/ui/vstack';
import CardLayout from '@/components/cards/CardLayout';

export default function ClubDetails() {
  const navigation = useNavigation();
  navigation.setOptions({ title: `Club Info` });
  const params = useLocalSearchParams();
  const clubId = Array.isArray(params.id) ? params.id[0] : params.id || '';
  
  const { data: clubInfo, isLoading, error } = useQuery<ClubInfoType, Error>(
    {
      queryKey: ['clubInfo', clubId],
      queryFn: () => fetchClubInfo(clubId),
      enabled: !!clubId,
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
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {clubInfo && 
          <>
            <Text style={styles.text}>{clubInfo.name} stats</Text>
            <VStack space="lg" style={styles.vStackContainer}>
              <CardLayout>
                <View style={styles.row}>
                  <Text style={styles.playerDetails}>Skill rating:</Text>
                  <Text style={styles.playerStat}>{clubInfo.skillRating}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.playerDetails}>Games played:</Text>
                  <Text style={styles.playerStat}>{clubInfo.gamesPlayed}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.playerDetails}>League games:</Text>
                  <Text style={styles.playerStat}>{clubInfo.leagueAppearances}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.playerDetails}>Playoff games:</Text>
                  <Text style={styles.playerStat}>{clubInfo.gamesPlayedPlayoff}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.playerDetails}>Wins:</Text>
                  <Text style={styles.playerStat}>{clubInfo.wins}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.playerDetails}>Draws:</Text>
                  <Text style={styles.playerStat}>{clubInfo.ties}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.playerDetails}>Defeats:</Text>
                  <Text style={styles.playerStat}>{clubInfo.losses}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.playerDetails}>Win streak:</Text>
                  <Text style={styles.playerStat}>{clubInfo.wins}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.playerDetails}>Goals scored:</Text>
                  <Text style={styles.playerStat}>{clubInfo.goals}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.playerDetails}>Goals conceded:</Text>
                  <Text style={styles.playerStat}>{clubInfo.goalsAgainst}</Text>
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
