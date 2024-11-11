import { StyleSheet, View, Dimensions, Text } from 'react-native';
import CardLayout from '@/components/cards/CardLayout';
import { Player } from '@/types/PlayerTypes';
import capitalizeFirstLetter from '@/utils/functions';

const { width: screenWidth } = Dimensions.get('window');

type Props = {
  players: Player[];
  position: string;
  onPress: (playerName: string) => void;
};

export default function PlayersByPosition({ players, position, onPress }: Props) {
  return (
    <>
        <Text style={styles.text}>{capitalizeFirstLetter(position)} ({players.length})</Text>
        <View style={styles.wrapContainer}>
          {players.length ? 
            players.sort((a, b) => parseInt(b.gamesPlayed) - parseInt(a.gamesPlayed)).map((player) => {
                return (
                    <CardLayout style={styles.card} onClick={() => onPress(player.name)}>
                        <View>
                            <Text style={styles.text}>{player.name}</Text>
                            <Text style={styles.playerDetails}>Games: {player.gamesPlayed}</Text>
                            <Text style={styles.playerDetails}>Goals: {player.goals}</Text>
                            <Text style={styles.playerDetails}>Assists: {player.assists}</Text>
                            <Text style={styles.playerDetails}>Average rating: {player.ratingAve}</Text>
                        </View>
                    </CardLayout>
                )
            }) : 
            <Text style={styles.playerDetails}>No {position} in the club</Text>
          }
        </View>
    </>
  );
};

const styles = StyleSheet.create({
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
});
