import { StyleSheet, Text } from 'react-native';
import CardLayout from './CardLayout';
import { ClubInfo as ClubInfoType } from '../../types/ClubInfoTypes';

type Props = {
    clubInfo: ClubInfoType;
};

export default function GamesCard({ clubInfo }: Props) {
  return (
    <CardLayout headerText='Games played:'>
        <Text style={styles.chartLabel}>Total = {clubInfo.gamesPlayed}</Text>
        <Text style={styles.chartLabel}>League = {clubInfo.leagueAppearances}</Text>
        <Text style={styles.chartLabel}>Playoffs = {clubInfo.gamesPlayedPlayoff}</Text>
    </CardLayout>
  )
}

const styles = StyleSheet.create({
    chartLabel: {
        fontSize: 16,
        color: '#ffffff',
        marginBottom: 8,
    },
});
