import { StyleSheet, Text, View } from 'react-native';
import CardLayout from './CardLayout';
import { ClubInfo as ClubInfoType, ClubStats } from '../../types/ClubInfoTypes';

type Props = {
    clubInfo: ClubInfoType;
    //TODO: add these new fields after i make the request to the api instead of having a custom hook?
    clubStats: ClubStats;
};

export default function ResultsCard({ clubInfo, clubStats }: Props) {
  return (
    <CardLayout headerText='Results:'>
        <Text style={styles.chartLabel}>Wins = {clubInfo.wins}</Text>
        <Text style={styles.chartLabel}>Draws = {clubInfo.ties}</Text>
        <Text style={styles.chartLabel}>Defeats = {clubInfo.losses}</Text>
        <View style={styles.barContainer}>
            <View style={[styles.barSegment, { backgroundColor: '#4CAF50', flex: clubStats.winPercentage }]} />
            <View style={[styles.barSegment, { backgroundColor: '#FFC107', flex: clubStats.tiePercentage }]} />
            <View style={[styles.barSegment, { backgroundColor: '#F44336', flex: clubStats.lossPercentage }]} />
        </View>
        <Text style={styles.chartLabel}>Win streak = {clubInfo.winStreak}</Text>
    </CardLayout>
  )
}

const styles = StyleSheet.create({
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
