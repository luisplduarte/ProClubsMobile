import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { useRouter } from "expo-router";
import { useQuery } from '@tanstack/react-query';
import CardLayout from './CardLayout';
import { ClubPlayersInfo, Player } from '@/types/PlayerTypes';
import { Link, LinkText } from '@/components/ui/link';
import { fetchClubPlayers } from '../../api/clubService';

export default function TopPlayersCard() {
  const router = useRouter();
  const { data: clubPlayers, isLoading: playersLoading, error: playersError } = useQuery<ClubPlayersInfo, Error>(
    {
      queryKey: ['clubPlayers'],
      queryFn: () => fetchClubPlayers()
    }
  );

  if (playersLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (playersError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Data unavailable.</Text>
      </View>
    );
  }
  
  const topScorers = clubPlayers?.members
    .sort((a: Player, b: Player) => parseInt(b.goals) - parseInt(a.goals))
    .slice(0, 3);

  const topAssists = clubPlayers?.members
    .sort((a: Player, b: Player) => parseInt(b.assists) - parseInt(a.assists))
    .slice(0, 3);

  const topAverageRating = clubPlayers?.members
    .sort((a: Player, b: Player) => parseFloat(b.ratingAve) - parseFloat(a.ratingAve))
    .slice(0, 3);

  return (
    <CardLayout headerText='Players:'>
        <Text style={styles.chartLabel}>Top scorers:</Text>
        {topScorers && topScorers.map((player) => (
            <View style={styles.row} key={player.name}>
                <Text style={styles.playerName}>{player.name}</Text>
                <Text style={styles.playerStat}>{player.goals} goals</Text>
            </View>
        ))}

        <Text style={styles.chartLabel}>Most assists:</Text>
        {topAssists && topAssists.map((player) => (
            <View style={styles.row} key={player.name}>
                <Text style={styles.playerName}>{player.name}</Text>
                <Text style={styles.playerStat}>{player.assists} assists</Text>
            </View>
        ))}

        {/* TODO: add component with different colors based on average rating */}
        <Text style={styles.chartLabel}>Top average rating:</Text>
        {topAverageRating && topAverageRating.map((player) => (
            <View style={styles.row} key={player.name}>
                <Text style={styles.playerName}>{player.name}</Text>
                <Text style={styles.playerStat}>{player.ratingAve}</Text>
            </View>
        ))}

        <Link>
            <LinkText style={styles.linkText} onPress={() => router.replace('/squad')}>View more</LinkText>
        </Link>
    </CardLayout>
  )
}

const styles = StyleSheet.create({
    chartLabel: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#ffffff',
        marginBottom: 0,
        marginTop: 12,
    },
    linkText: {
        fontWeight: 'bold',
        fontSize: 16,
        textDecorationLine: 'none',
        color: '#ffffff',
        marginTop: 16,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 4,
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
    text: {
        fontSize: 16,
        color: '#ffffff',
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
});
