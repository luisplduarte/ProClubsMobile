import { View, StyleSheet, Text, ActivityIndicator, Dimensions, ScrollView } from 'react-native';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Carousel from 'react-native-reanimated-carousel';
import { fetchClubPlayers } from '../../api/clubService';
import { ClubPlayersInfo, Player } from '@/types/PlayerTypes';
import StatSection from '@/components/StatSection';
import { Accordion, AccordionContent, AccordionHeader, AccordionItem, AccordionTitleText, AccordionTrigger } from '@/components/ui/accordion';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const { width: screenWidth } = Dimensions.get('window');

export default function ClubLeaderboards() { 
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

        <StatSection headerText={'Matches played:'} statKey={'topMatchesPlayed'} data={sortedStats.topMatchesPlayed} renderValue={(player) => player.gamesPlayed} />
        <StatSection headerText={'Most MOTM:'} statKey={'topManOfTheMatch'} data={sortedStats.topManOfTheMatch} renderValue={(player) => player.manOfTheMatch} />
        <StatSection headerText={'Average rating:'} statKey={'topAverageRating'} data={sortedStats.topAverageRating} renderValue={(player) => player.ratingAve} />

        <Accordion style={styles.accordionContainer}>
          <AccordionItem value="Attack">
            <AccordionHeader>
              <AccordionTrigger>
                {({ isExpanded }) => {
                  return (
                    <>
                      <AccordionTitleText>Attack:</AccordionTitleText>
                      {isExpanded ? (
                        <FontAwesome name={'chevron-up'}/>
                      ) : (
                        <FontAwesome name={'chevron-down'}/>
                      )}
                    </>
                  )
                }}
              </AccordionTrigger>
            </AccordionHeader>
            <AccordionContent children={
              <View>
                <StatSection headerText={'Top scorers:'} statKey={'topScorers'} data={sortedStats.topScorers} renderValue={(player) => player.goals} />
                <StatSection headerText={'Most assists:'} statKey={'topAssists'} data={sortedStats.topAssists} renderValue={(player) => player.assists} />
                <StatSection headerText={'Goals + assists:'} statKey={'topGoalsAndAssists'} data={sortedStats.topGoalsAndAssists} renderValue={(player) => parseInt(player.goals) + parseInt(player.assists)} />
                <StatSection headerText={'Passes per match:'} statKey={'topPassesPerMatch'} data={sortedStats.topPassesPerMatch} renderValue={(player) => (parseInt(player.passesMade) / parseInt(player.gamesPlayed)).toFixed(2)} />
                <StatSection headerText={'Pass success rate:'} statKey={'topPassSuccessRate'} data={sortedStats.topPassSuccessRate} renderValue={(player) => `${player.passSuccessRate} %`} />
              </View>
            }/>
          </AccordionItem>

          <AccordionItem value="Defense">
            <AccordionHeader>
              <AccordionTrigger>
                {({ isExpanded }) => {
                  return (
                    <>
                      <AccordionTitleText>Defense:</AccordionTitleText>
                      {isExpanded ? (
                        <FontAwesome name={'chevron-up'}/>
                      ) : (
                        <FontAwesome name={'chevron-down'}/>
                      )}
                    </>
                  )
                }}
              </AccordionTrigger>
            </AccordionHeader>
            <AccordionContent children={
              <View>
                <StatSection headerText={'Tackles per match:'} statKey={'topAssists'} data={sortedStats.topTacklesPerMatch} renderValue={(player) => (parseInt(player.tacklesMade) / parseInt(player.gamesPlayed)).toFixed(2)} />
                <StatSection headerText={'Tackle success rate:'} statKey={'topTackleSuccessRate'} data={sortedStats.topTackleSuccessRate} renderValue={(player) => `${player.tackleSuccessRate} %`} />
                <StatSection headerText={'Defensive clean sheets:'} statKey={'topDefensiveCleanSheets'} data={sortedStats.topDefensiveCleanSheets} renderValue={(player) => player.cleanSheetsDef} />
              </View>
            }/>
          </AccordionItem>
        </Accordion>

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
  accordionContainer: {
    backgroundColor: '#ffffff',
    width: '100%',
    borderRadius: 8,
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
});
