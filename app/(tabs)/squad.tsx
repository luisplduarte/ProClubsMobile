import { View, StyleSheet, Text, ActivityIndicator, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import Carousel from 'react-native-reanimated-carousel';
import { useQuery } from '@tanstack/react-query';
import { fetchClubPlayers } from '../../api/clubService';
import { ClubPlayersInfo, Player } from '@/types/PlayerTypes';
import CardLayout from '@/components/cards/CardLayout';

const { width: screenWidth } = Dimensions.get('window');

export default function Squad() { 
  const [showAllTopMatchesPlayed, setShowAllTopMatchesPlayed] = useState(false);
  const [showAllTopManOfTheMatch, setShowAllTopManOfTheMatch] = useState(false);
  const [showAllTopScorers, setShowAllTopScorers] = useState(false);
  const [showAllTopAssists, setShowAllTopAssists] = useState(false);
  const [showAllTopGoalsAndAssists, setShowAllTopGoalsAndAssists] = useState(false);
  const [showAllTopRatings, setShowAllTopRatings] = useState(false);
  const [showAllTopPassesPerMatch, setShowAllTopPassesPerMatch] = useState(false);
  const [showAllTopPassSuccessRate, setShowAllTopPassSuccessRate] = useState(false);
  const [showAllTopTacklesPerMatch, setShowAllTopTacklesPerMatch] = useState(false);
  const [showAllTopTackleSuccessRate, setShowAllTopTackleSuccessRate] = useState(false);
  const [showAllTopDefensiveCleanSheets, setShowAllTopDefensiveCleanSheets] = useState(false);
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

  const topMatchesPlayed = clubPlayers?.members
    .slice()
    .sort((a: Player, b: Player) => parseInt(b.gamesPlayed) - parseInt(a.gamesPlayed))

  const topManOfTheMatch = clubPlayers?.members
    .slice()
    .sort((a: Player, b: Player) => parseInt(b.manOfTheMatch) - parseInt(a.manOfTheMatch))

  const topScorers = clubPlayers?.members
    .slice()
    .sort((a: Player, b: Player) => parseInt(b.goals) - parseInt(a.goals))

  const topAssists = clubPlayers?.members
    .slice()
    .sort((a: Player, b: Player) => parseInt(b.assists) - parseInt(a.assists))

  const topGoalsAndAssists = clubPlayers?.members
    .slice()
    .sort((a: Player, b: Player) => (parseInt(b.goals) + parseInt(b.assists)) - (parseInt(a.goals) + parseInt(a.assists)))

  const topAverageRating = clubPlayers?.members
    .slice()
    .sort((a: Player, b: Player) => parseFloat(b.ratingAve) - parseFloat(a.ratingAve))

  const topPassesPerMatch = clubPlayers?.members
    .slice()
    .sort((a: Player, b: Player) => (parseInt(b.passesMade) / parseInt(b.gamesPlayed)) - (parseInt(a.passesMade) / parseInt(a.gamesPlayed)))

  const topPassSuccessRate = clubPlayers?.members
    .slice()
    .sort((a: Player, b: Player) => parseFloat(b.passSuccessRate) - parseFloat(a.passSuccessRate))

  const topTacklesPerMatch = clubPlayers?.members
    .slice()
    .sort((a: Player, b: Player) => (parseInt(b.tacklesMade) / parseInt(b.gamesPlayed)) - (parseInt(a.tacklesMade) / parseInt(a.gamesPlayed)))

  const topTackleSuccessRate = clubPlayers?.members
    .slice()
    .sort((a: Player, b: Player) => parseInt(b.tackleSuccessRate) - parseInt(a.tackleSuccessRate))

  const topDefensiveCleanSheets = clubPlayers?.members
    .slice()
    .sort((a: Player, b: Player) => parseInt(b.cleanSheetsDef) - parseInt(a.cleanSheetsDef))

  const renderPlayerItem = ({ item }: { item: Player }) => (
    <View style={styles.carouselItem}>
      <Text style={styles.text}>{item.name}</Text>
      <Text style={styles.playerDetails}>Goals: {item.goals}</Text>
      <Text style={styles.playerDetails}>Assists: {item.assists}</Text>
      <Text style={styles.playerDetails}>Rating: {item.ratingAve}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.text}>Squad</Text>
        {clubPlayers && (
          <Carousel
            loop
            width={screenWidth * 0.85}
            height={180}
            mode="parallax"
            data={clubPlayers.members}
            scrollAnimationDuration={1000}
            renderItem={renderPlayerItem}
          />
        )}

        <Text style={styles.text}>Squad stats</Text>

        <CardLayout headerText='Matches played:'>
          {topMatchesPlayed && (showAllTopMatchesPlayed ? topMatchesPlayed : topMatchesPlayed?.slice(0, 5)).map((player) => (
            <View style={styles.row} key={player.name}>
              <Text style={styles.playerName}>{player.name}</Text>
              <Text style={styles.playerStat}>{player.gamesPlayed}</Text>
            </View>
          ))}

          {!showAllTopMatchesPlayed && topMatchesPlayed && topMatchesPlayed.length > 5 && (
            <TouchableOpacity onPress={() => setShowAllTopMatchesPlayed(true)}>
              <Text style={styles.viewMoreText}>View more</Text>
            </TouchableOpacity>
          )}
        </CardLayout>

        <CardLayout headerText='Most MOTM:'>
          {topManOfTheMatch && (showAllTopManOfTheMatch ? topManOfTheMatch : topManOfTheMatch?.slice(0, 5)).map((player) => (
            <View style={styles.row} key={player.name}>
              <Text style={styles.playerName}>{player.name}</Text>
              <Text style={styles.playerStat}>{player.manOfTheMatch}</Text>
            </View>
          ))}

          {!showAllTopManOfTheMatch && topManOfTheMatch && topManOfTheMatch.length > 5 && (
            <TouchableOpacity onPress={() => setShowAllTopManOfTheMatch(true)}>
              <Text style={styles.viewMoreText}>View more</Text>
            </TouchableOpacity>
          )}
        </CardLayout>

        <CardLayout headerText='Top scorers:'>
          {topScorers && (showAllTopScorers ? topScorers : topScorers?.slice(0, 5)).map((player) => (
            <View style={styles.row} key={player.name}>
              <Text style={styles.playerName}>{player.name}</Text>
              <Text style={styles.playerStat}>{player.goals}</Text>
            </View>
          ))}

          {!showAllTopScorers && topScorers && topScorers.length > 5 && (
            <TouchableOpacity onPress={() => setShowAllTopScorers(true)}>
              <Text style={styles.viewMoreText}>View more</Text>
            </TouchableOpacity>
          )}
        </CardLayout>

        <CardLayout headerText='Most assists:'>
          {topAssists && (showAllTopAssists ? topAssists : topAssists?.slice(0, 5)).map((player) => (
            <View style={styles.row} key={player.name}>
              <Text style={styles.playerName}>{player.name}</Text>
              <Text style={styles.playerStat}>{player.assists}</Text>
            </View>
          ))}

          {!showAllTopAssists && topAssists && topAssists.length > 5 && (
            <TouchableOpacity onPress={() => setShowAllTopAssists(true)}>
              <Text style={styles.viewMoreText}>View more</Text>
            </TouchableOpacity>
          )}
        </CardLayout>

        <CardLayout headerText='Goals + assists:'>
          {topGoalsAndAssists && (showAllTopGoalsAndAssists ? topGoalsAndAssists : topGoalsAndAssists?.slice(0, 5)).map((player) => (
            <View style={styles.row} key={player.name}>
              <Text style={styles.playerName}>{player.name}</Text>
              <Text style={styles.playerStat}>{parseInt(player.goals) + parseInt(player.assists)}</Text>
            </View>
          ))}

          {!showAllTopGoalsAndAssists && topGoalsAndAssists && topGoalsAndAssists.length > 5 && (
            <TouchableOpacity onPress={() => setShowAllTopGoalsAndAssists(true)}>
              <Text style={styles.viewMoreText}>View more</Text>
            </TouchableOpacity>
          )}
        </CardLayout>

        <CardLayout headerText='Average rating:'>
          {topAverageRating && (showAllTopRatings ? topAverageRating : topAverageRating?.slice(0, 5)).map((player) => (
            <View style={styles.row} key={player.name}>
              <Text style={styles.playerName}>{player.name}</Text>
              <Text style={styles.playerStat}>{player.ratingAve}</Text>
            </View>
          ))}

          {!showAllTopRatings && topAverageRating && topAverageRating.length > 5 && (
            <TouchableOpacity onPress={() => setShowAllTopRatings(true)}>
              <Text style={styles.viewMoreText}>View more</Text>
            </TouchableOpacity>
          )}
        </CardLayout>

        <CardLayout headerText='Passes per match:'>
          {topPassesPerMatch && (showAllTopPassesPerMatch ? topPassesPerMatch : topPassesPerMatch?.slice(0, 5)).map((player) => (
            <View style={styles.row} key={player.name}>
              <Text style={styles.playerName}>{player.name}</Text>
              <Text style={styles.playerStat}>{(parseInt(player.passesMade) / parseInt(player.gamesPlayed)).toFixed(2)}</Text>
            </View>
          ))}

          {!showAllTopPassesPerMatch && topPassesPerMatch && topPassesPerMatch.length > 5 && (
            <TouchableOpacity onPress={() => setShowAllTopPassesPerMatch(true)}>
              <Text style={styles.viewMoreText}>View more</Text>
            </TouchableOpacity>
          )}
        </CardLayout>

        <CardLayout headerText='Pass success rate:'>
          {topPassSuccessRate && (showAllTopPassSuccessRate ? topPassSuccessRate : topPassSuccessRate?.slice(0, 5)).map((player) => (
            <View style={styles.row} key={player.name}>
              <Text style={styles.playerName}>{player.name}</Text>
              <Text style={styles.playerStat}>{player.passSuccessRate} %</Text>
            </View>
          ))}

          {!showAllTopPassSuccessRate && topPassSuccessRate && topPassSuccessRate.length > 5 && (
            <TouchableOpacity onPress={() => setShowAllTopPassSuccessRate(true)}>
              <Text style={styles.viewMoreText}>View more</Text>
            </TouchableOpacity>
          )}
        </CardLayout>

        <CardLayout headerText='Tackles per match:'>
          {topTacklesPerMatch && (showAllTopTacklesPerMatch ? topTacklesPerMatch : topTacklesPerMatch?.slice(0, 5)).map((player) => (
            <View style={styles.row} key={player.name}>
              <Text style={styles.playerName}>{player.name}</Text>
              <Text style={styles.playerStat}>{(parseInt(player.tacklesMade) / parseInt(player.gamesPlayed)).toFixed(2)}</Text>
            </View>
          ))}

          {!showAllTopTacklesPerMatch && topTacklesPerMatch && topTacklesPerMatch.length > 5 && (
            <TouchableOpacity onPress={() => setShowAllTopTacklesPerMatch(true)}>
              <Text style={styles.viewMoreText}>View more</Text>
            </TouchableOpacity>
          )}
        </CardLayout>

        <CardLayout headerText='Tackle success rate:'>
          {topTackleSuccessRate && (showAllTopTackleSuccessRate ? topTackleSuccessRate : topTackleSuccessRate?.slice(0, 5)).map((player) => (
            <View style={styles.row} key={player.name}>
              <Text style={styles.playerName}>{player.name}</Text>
              <Text style={styles.playerStat}>{player.tackleSuccessRate} %</Text>
            </View>
          ))}

          {!showAllTopTackleSuccessRate && topTackleSuccessRate && topTackleSuccessRate.length > 5 && (
            <TouchableOpacity onPress={() => setShowAllTopTackleSuccessRate(true)}>
              <Text style={styles.viewMoreText}>View more</Text>
            </TouchableOpacity>
          )}
        </CardLayout>

        <CardLayout headerText='Defensive clean sheets:'>
          {topDefensiveCleanSheets && (showAllTopDefensiveCleanSheets ? topDefensiveCleanSheets : topDefensiveCleanSheets?.slice(0, 5)).map((player) => (
            <View style={styles.row} key={player.name}>
              <Text style={styles.playerName}>{player.name}</Text>
              <Text style={styles.playerStat}>{player.cleanSheetsDef}</Text>
            </View>
          ))}

          {!showAllTopDefensiveCleanSheets && topDefensiveCleanSheets && topDefensiveCleanSheets.length > 5 && (
            <TouchableOpacity onPress={() => setShowAllTopDefensiveCleanSheets(true)}>
              <Text style={styles.viewMoreText}>View more</Text>
            </TouchableOpacity>
          )}
        </CardLayout>
        
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
  card: {
    marginBottom: 16,
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
  viewMoreText: {
    fontWeight: 'bold',
    fontSize: 16,
    textDecorationLine: 'none',
    color: '#ffffff',
    marginTop: 8,
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
  playerName: {
    fontSize: 16,
    color: '#ffffff',
    flex: 1,
  },
  playerStat: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'right',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
});
