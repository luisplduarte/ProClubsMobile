import { View, StyleSheet, Text, ActivityIndicator, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Carousel from 'react-native-reanimated-carousel';
import { fetchClubPlayers } from '../../api/clubService';
import { ClubPlayersInfo, Player } from '@/types/PlayerTypes';
import StatSection from '@/components/StatSection';

const { width: screenWidth } = Dimensions.get('window');

export default function ClubLeaderboards() { 
  const [selectedTab, setSelectedTab] = useState<string>('Overall');
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

  const sortedStats = {
    topMatchesPlayed: clubPlayers?.members.slice().sort((a, b) => parseInt(b.gamesPlayed) - parseInt(a.gamesPlayed)) || [],
    topManOfTheMatch: clubPlayers?.members.slice().sort((a, b) => parseInt(b.manOfTheMatch) - parseInt(a.manOfTheMatch)) || [],
    topScorers: clubPlayers?.members.slice().sort((a, b) => parseInt(b.goals) - parseInt(a.goals)) || [],
    topAssists: clubPlayers?.members.slice().sort((a, b) => parseInt(b.assists) - parseInt(a.assists)) || [],
    topGoalsAndAssists: clubPlayers?.members.slice().sort((a, b) => (parseInt(b.goals) + parseInt(b.assists)) - (parseInt(a.goals) + parseInt(a.assists))) || [],
    topAverageRating: clubPlayers?.members.slice().sort((a, b) => parseFloat(b.ratingAve) - parseFloat(a.ratingAve)) || [],
    topPassesPerMatch: clubPlayers?.members.slice().sort((a, b) => (parseInt(b.passesMade) / parseInt(b.gamesPlayed)) - (parseInt(a.passesMade) / parseInt(a.gamesPlayed))) || [],
    topPassSuccessRate: clubPlayers?.members.slice().sort((a, b) => parseFloat(b.passSuccessRate) - parseFloat(a.passSuccessRate)) || [],
    topTacklesPerMatch: clubPlayers?.members.slice().sort((a, b) => (parseInt(b.tacklesMade) / parseInt(b.gamesPlayed)) - (parseInt(a.tacklesMade) / parseInt(a.gamesPlayed))) || [],
    topTackleSuccessRate: clubPlayers?.members.slice().sort((a, b) => parseInt(b.tackleSuccessRate) - parseInt(a.tackleSuccessRate)) || [],
    topDefensiveCleanSheets: clubPlayers?.members.slice().sort((a, b) => parseInt(b.cleanSheetsDef) - parseInt(a.cleanSheetsDef)) || [],
  };

  const tabs = [
    { key: 'Overall', label: 'Overall' },
    { key: 'Attack', label: 'Attack' },
    { key: 'Defense', label: 'Defense' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.text}>Squad stats</Text>

        {clubPlayers && (
          <Carousel
            loop
            width={screenWidth * 0.85}
            height={180}
            mode="parallax"
            data={clubPlayers.members}
            scrollAnimationDuration={1000}
            renderItem={({ item }: { item: Player }) => (
              <View style={styles.carouselItem}>
                <Text style={styles.text}>{item.name}</Text>
                <Text style={styles.playerDetails}>Goals: {item.goals}</Text>
                <Text style={styles.playerDetails}>Assists: {item.assists}</Text>
                <Text style={styles.playerDetails}>Average rating: {item.ratingAve}</Text>
              </View>
            )}
          />
        )}

        <View style={styles.tabsContainer}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, selectedTab === tab.key && styles.activeTab]}
              onPress={() => setSelectedTab(tab.key)}
            >
              <Text style={[styles.tabText, selectedTab === tab.key && styles.activeTabText]}>{tab.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ width: '85%' }}>
          {selectedTab === 'Overall' ?
            <>
              <StatSection headerText={'Matches played:'} statKey={'topMatchesPlayed'} data={sortedStats.topMatchesPlayed} renderValue={(player) => player.gamesPlayed} />
              <StatSection headerText={'Most MOTM:'} statKey={'topManOfTheMatch'} data={sortedStats.topManOfTheMatch} renderValue={(player) => player.manOfTheMatch} />
              <StatSection headerText={'Average rating:'} statKey={'topAverageRating'} data={sortedStats.topAverageRating} renderValue={(player) => player.ratingAve} />
            </>
            : 
            selectedTab === 'Attack' ? 
              <>
                <StatSection headerText={'Top scorers:'} statKey={'topScorers'} data={sortedStats.topScorers} renderValue={(player) => player.goals} />
                <StatSection headerText={'Most assists:'} statKey={'topAssists'} data={sortedStats.topAssists} renderValue={(player) => player.assists} />
                <StatSection headerText={'Goals + assists:'} statKey={'topGoalsAndAssists'} data={sortedStats.topGoalsAndAssists} renderValue={(player) => parseInt(player.goals) + parseInt(player.assists)} />
                <StatSection headerText={'Passes per match:'} statKey={'topPassesPerMatch'} data={sortedStats.topPassesPerMatch} renderValue={(player) => (parseInt(player.passesMade) / parseInt(player.gamesPlayed)).toFixed(2)} />
                <StatSection headerText={'Pass success rate:'} statKey={'topPassSuccessRate'} data={sortedStats.topPassSuccessRate} renderValue={(player) => `${player.passSuccessRate} %`} />
              </>
            :
            <>
              <StatSection headerText={'Tackles per match:'} statKey={'topTacklesPerMatch'} data={sortedStats.topTacklesPerMatch} renderValue={(player) => (parseInt(player.tacklesMade) / parseInt(player.gamesPlayed)).toFixed(2)} />
              <StatSection headerText={'Tackle success rate:'} statKey={'topTackleSuccessRate'} data={sortedStats.topTackleSuccessRate} renderValue={(player) => `${player.tackleSuccessRate} %`} />
              <StatSection headerText={'Defensive clean sheets:'} statKey={'topDefensiveCleanSheets'} data={sortedStats.topDefensiveCleanSheets} renderValue={(player) => player.cleanSheetsDef} />
            </>
          }
        </View>
        
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
  },
  carouselItem: {
    backgroundColor: '#1c1c1e',
    borderRadius: 8,
    padding: 0,
    flex: 1,
    width: screenWidth * 0.80,
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playerDetails: {
    fontSize: 16,
    color: '#ffffff',
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#646466',
    paddingVertical: 8,
    width: '85%',
    borderRadius: 8,
    marginBottom: 8,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#C02727',
  },
  tabText: {
    color: '#fff',
  },
  activeTabText: {
    fontWeight: 'bold',
  },
});
