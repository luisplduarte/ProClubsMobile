import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Player } from '@/types/PlayerTypes';
import CardLayout from '@/components/cards/CardLayout';

interface StatSectionProps {
  headerText: string;
  statKey: string;
  data: Player[];
  renderValue: (player: Player) => string | number;
}

/**
 * Component that shows top 5 or all club players ordered by stats
 * @param headerText text identifying which stat is being displayed
 * @param statKey key of the status to be displayed
 * @param data club players ordered by stat to be shown
 * @param renderValue player's stat value to be shown
 * @returns 
 */
export default function StatSection({ headerText, statKey, data, renderValue }: StatSectionProps) {
  const [showAllStats, setShowAllStats] = useState<Record<string, boolean>>({});

  const toggleShowAll = (statKey: string) => {
    setShowAllStats(prev => ({ ...prev, [statKey]: !prev[statKey] }));
  };

  return (
    data && data.length ?
      <CardLayout headerText={headerText}>
        {data && (showAllStats[statKey] ? data : data.slice(0, 5)).map(player => (
          <View style={styles.row} key={player.name}>
            <Text style={styles.playerName}>{player.name}</Text>
            <Text style={styles.playerStat}>{renderValue(player)}</Text>
          </View>
        ))}
        {!showAllStats[statKey] && data.length > 5 && (
          <TouchableOpacity onPress={() => toggleShowAll(statKey)}>
            <Text style={styles.viewMoreText}>View more</Text>
          </TouchableOpacity>
        )}
      </CardLayout> : 
      <CardLayout headerText={headerText}>
        <Text style={styles.playerName}>No players.</Text>
      </CardLayout>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
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
