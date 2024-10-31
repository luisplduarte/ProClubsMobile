import { View, StyleSheet, Text, ActivityIndicator, ScrollView } from 'react-native';
import React from 'react';
import { useRouter } from "expo-router";
import { useQuery } from '@tanstack/react-query';
import { Box } from "@/components/ui/box"
import { HStack } from "@/components/ui/hstack"
import { VStack } from '@/components/ui/vstack';
import { Link, LinkText } from '@/components/ui/link';
import { fetchClubInfo, fetchClubPlayers } from '../../api/clubService';
import { ClubInfo as ClubInfoType } from '../../types/ClubInfoTypes';
import { ClubPlayersInfo, Player } from '@/types/PlayerTypes';
import CardLayout from '@/components/cards/CardLayout';
import GamesCard from '@/components/cards/GamesCard';
import ResultsCard from '@/components/cards/ResultsCard';
import { useClubStats } from '@/hooks/useClubStats';
import GoalsCard from '@/components/cards/GoalsCard';

export default function Club() {  
  const router = useRouter();
  const { data: clubData, isLoading: clubInfoLoading, error: clubError } = useQuery<ClubInfoType, Error>(
    {
      queryKey: ['clubInfo'],
      queryFn: () => fetchClubInfo()
    }
  );
  const { data: clubPlayers, isLoading: playersLoading, error: playersError } = useQuery<ClubPlayersInfo, Error>(
    {
      queryKey: ['clubPlayers'],
      queryFn: () => fetchClubPlayers()
    }
  );
  const clubStats = useClubStats(clubData);
  
  if (clubInfoLoading || playersLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (clubError || playersError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Data unavailable.</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      {clubData && clubPlayers && clubStats &&
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <Text style={styles.pageHeader}>{clubData.name}</Text>
          <Text style={styles.pageText}>Skill rating = {clubData.skillRating}</Text>

          <VStack space="lg" style={styles.vStackContainer}>
            <GamesCard clubInfo={clubData} />
            <ResultsCard clubInfo={clubData} clubStats={clubStats} />
            <GoalsCard clubInfo={clubData} clubStats={clubStats} />
              
            {/* TODO: change this "Players card" to show top 3 goals scorers, assisters and average rating */}
            <CardLayout headerText='Players:'>
              {clubPlayers.members.map((player) => (
                <Text style={styles.text} key={player.name}>{player.name}</Text>
              ))}
              <Link>
                <LinkText style={styles.linkText} onPress={() => router.replace('/squad')}>View more</LinkText>
              </Link>
            </CardLayout>
             
          </VStack>
        </ScrollView>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  vStackContainer: {
    width: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    // justifyContent: 'center',
  },
  scrollContainer: {
    // paddingHorizontal: 16,
    paddingBottom: 24,
    // alignItems: 'center',
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
    fontSize: 16,
    color: '#ffffff',
  },
  linkText: {
    fontWeight: 'bold',
    fontSize: 16,
    textDecorationLine: 'none',
    color: '#ffffff',
  },
  pageHeader: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#ffffff',
    paddingBottom: 8,
    textAlign: 'center',
  },
  pageText: {
    fontSize: 16,
    color: '#ffffff',
    paddingBottom: 16,
    textAlign: 'center',
  },
  headerText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#ffffff',
    paddingBottom: 24,
  },
  chartLabel: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 8,
  },
  barContainer: {
    flexDirection: 'row',
    height: 20,
    width: '100%',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barSegment: {
    height: '100%',
  },
});
