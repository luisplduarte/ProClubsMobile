import { View, StyleSheet, Text, ActivityIndicator, ScrollView } from 'react-native';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { VStack } from '@/components/ui/vstack';
import { fetchClubInfo } from '../../api/clubService';
import { ClubInfo as ClubInfoType } from '../../types/ClubInfoTypes';
import GamesCard from '@/components/cards/GamesCard';
import ResultsCard from '@/components/cards/ResultsCard';
import { useClubStats } from '@/hooks/useClubStats';
import GoalsCard from '@/components/cards/GoalsCard';
import TopPlayersCard from '@/components/cards/TopPlayersCard';

export default function Club() {  
  const { data: clubData, isLoading: clubInfoLoading, error: clubError } = useQuery<ClubInfoType, Error>(
    {
      queryKey: ['clubInfo'],
      queryFn: () => fetchClubInfo()
    }
  );
  const clubStats = useClubStats(clubData);
  
  if (clubInfoLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (clubError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Data unavailable.</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      {clubData && clubStats &&
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <Text style={styles.pageHeader}>{clubData.name}</Text>
          <Text style={styles.pageText}>Skill rating = {clubData.skillRating}</Text>

          <VStack space="lg" style={styles.vStackContainer}>
            <GamesCard clubInfo={clubData} />
            <ResultsCard clubInfo={clubData} clubStats={clubStats} />
            <GoalsCard clubInfo={clubData} clubStats={clubStats} />
            <TopPlayersCard/>
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
  },
  scrollContainer: {
    paddingBottom: 24,
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
});
