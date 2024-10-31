import { StyleSheet, Text, View } from 'react-native';
import CardLayout from './CardLayout';
import { ClubInfo as ClubInfoType, ClubStats } from '../../types/ClubInfoTypes';

type Props = {
    clubInfo: ClubInfoType;
    //TODO: add these new fields after i make the request to the api instead of having a custom hook?
    clubStats: ClubStats;
};

export default function GoalsCard({ clubInfo, clubStats }: Props) {
  return (
    <CardLayout headerText='Goals:'>
        <Text style={styles.chartLabel}>Goals scored = {clubInfo.goals}</Text>
        <Text style={styles.chartLabel}>Goals conceded = {clubInfo.goalsAgainst}</Text>
        <Text style={styles.chartLabel}>Goal difference = {clubStats.goalDifference > 0 ? '+' : '-'}{clubStats.goalDifference}</Text>
        <View style={styles.barContainer}>
            <View style={[styles.barSegment, { backgroundColor: '#4CAF50', flex: clubStats.goalsScoredPercentage }]} />
            <View style={[styles.barSegment, { backgroundColor: '#F44336', flex: clubStats.goalsConcededPercentage }]} />
        </View>
        <Text style={styles.chartLabel}>Goals scored per match = {(parseInt(clubInfo.goals) / clubStats.totalGames).toFixed(2)}</Text>
        <Text style={styles.chartLabel}>Goals conceded per match = {(parseInt(clubInfo.goalsAgainst) / clubStats.totalGames).toFixed(2)}</Text>
    </CardLayout>
  )
}

const styles = StyleSheet.create({
    //TODO: these style are repeated in the different cards components - improve
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
