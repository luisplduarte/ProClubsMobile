import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchClubInfo } from '../../api/clubService';
import { ClubInfo as ClubInfoType } from '../../types/ClubInfoTypes';
import { PieChart } from 'react-native-gifted-charts';

export default function Club() {  
  const { data: clubData, isLoading, error } = useQuery<ClubInfoType, Error>(
    {
      queryKey: ['clubInfo'],
      queryFn: () => fetchClubInfo()
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

  let pieData: { value: number; color: string; text: string; }[] | undefined = [];
  if (clubData) {
    const totalGames = parseInt(clubData.wins) + parseInt(clubData.ties) + parseInt(clubData.losses);
    const winPercentage = (parseInt(clubData.wins) / totalGames) * 100;
    const tiePercentage = (parseInt(clubData.ties) / totalGames) * 100;
    const lossPercentage = (parseInt(clubData.losses) / totalGames) * 100;
  
    pieData = [
      { value: winPercentage, color: '#4CAF50', text: 'Wins' },
      { value: tiePercentage, color: '#FFC107', text: 'Draws' },
      { value: lossPercentage, color: '#F44336', text: 'Defeats' },
    ];
  }
  
  return (
    <View style={styles.container}>
      {clubData && 
        <View style={styles.container}>
          <Text style={styles.headerText}>{clubData.name}</Text>
          <Text style={styles.text}>Region id: {clubData.regionId}</Text>

          <PieChart
            data={pieData}
            showText
            textColor="white"
            radius={80}
            innerRadius={0}
            textSize={18}
            strokeColor="#25292e"
            strokeWidth={2}
            // centerLabelComponent={() => (
            //   <Text style={styles.chartCenterLabel}>
            //       Results
            //   </Text>
            // )}
          />
        </View>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    paddingBottom: 16,
  },
  chartCenterLabel: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
