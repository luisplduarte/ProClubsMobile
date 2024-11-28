import { View, StyleSheet, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useLocalSearchParams } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { fetchClubInfo } from '../api/clubService';
import { ClubInfo as ClubInfoType } from '../types/ClubInfoTypes';
import { VStack } from '@/components/ui/vstack';
import CardLayout from '@/components/cards/CardLayout';
import { HStack } from '@/components/ui/hstack';
import { addClubToFavorites, removeClubFromFavorites } from '@/api/favoritesService';
import CustomToast from '@/components/CustomToast';
import { ToastTypes } from '@/types/ToastTypes';

export default function ClubDetails() {
  const queryClient = useQueryClient();
  const navigation = useNavigation();
  navigation.setOptions({ title: `Club Info` });
  const params = useLocalSearchParams();
  const clubId = Array.isArray(params.id) ? params.id[0] : params.id || '';
  const { data: clubInfo, isLoading, error } = useQuery<ClubInfoType, Error>(
    {
      queryKey: ['clubInfo', clubId],
      queryFn: () => fetchClubInfo(clubId),
      enabled: !!clubId,
    }
  );

  const addClubToFavoritesMutation = useMutation({
    mutationFn: (club: ClubInfoType) => addClubToFavorites(club),
    onSuccess: () => {
      Promise.all([    
        queryClient.invalidateQueries({ queryKey: ['clubInfo', clubId] }),
        queryClient.invalidateQueries({ queryKey: ['favoriteClubs'] })
      ])
      CustomToast({ 
        type: ToastTypes.SUCCESS, 
        title: 'Action Successful', 
        message: 'Club added to favorites!'
      });
    },
    onError: (err) => {
      CustomToast({ 
        type: ToastTypes.ERROR, 
        title: 'Action Failed', 
        message: 'Couldn\'t add club to favorites!'
      });
    },
  });

  const removeClubFromFavoritesMutation = useMutation({
    mutationFn: (club: ClubInfoType) => removeClubFromFavorites(club),
    onSuccess: () => {
      Promise.all([    
        queryClient.invalidateQueries({ queryKey: ['clubInfo', clubId] }),
        queryClient.invalidateQueries({ queryKey: ['favoriteClubs'] })
      ])
      CustomToast({ 
        type: ToastTypes.SUCCESS, 
        title: 'Action Successful', 
        message: 'Club removed from favorites!'
      });
    },
    onError: () => {
      CustomToast({ 
        type: ToastTypes.ERROR, 
        title: 'Action Failed', 
        message: 'Couldn\'t remove club from favorites!'
      });
    },
  });

  const toggleFavorite = async () => { 
    if (!clubInfo) return;
    const newValue = !clubInfo.isFavorite;
    if (newValue) addClubToFavoritesMutation.mutate(clubInfo);
    else removeClubFromFavoritesMutation.mutate(clubInfo);
  };

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

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {clubInfo && 
          <>
            <View style={styles.nameContainer}>
              <Text style={styles.title}>{clubInfo.name}</Text>
              <TouchableOpacity onPress={toggleFavorite}>
                <FontAwesome name={'heart'} color={clubInfo.isFavorite ? '#ff5c5c' : '#646466'} size={32} style={{ margin: 8 }} />
              </TouchableOpacity>
            </View>
            
            <VStack space="lg" style={styles.vStackContainer}>
              <CardLayout>
                <View style={styles.row}>
                  <Text style={styles.playerDetails}>Skill rating:</Text>
                  <Text style={styles.playerStat}>{clubInfo.skillRating}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.playerDetails}>Games played:</Text>
                  <Text style={styles.playerStat}>{clubInfo.gamesPlayed}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.playerDetails}>League games:</Text>
                  <Text style={styles.playerStat}>{clubInfo.leagueAppearances}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.playerDetails}>Playoff games:</Text>
                  <Text style={styles.playerStat}>{clubInfo.gamesPlayedPlayoff}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.playerDetails}>Wins:</Text>
                  <Text style={styles.playerStat}>{clubInfo.wins}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.playerDetails}>Draws:</Text>
                  <Text style={styles.playerStat}>{clubInfo.ties}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.playerDetails}>Defeats:</Text>
                  <Text style={styles.playerStat}>{clubInfo.losses}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.playerDetails}>Win streak:</Text>
                  <Text style={styles.playerStat}>{clubInfo.wins}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.playerDetails}>Goals scored:</Text>
                  <Text style={styles.playerStat}>{clubInfo.goals}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.playerDetails}>Goals conceded:</Text>
                  <Text style={styles.playerStat}>{clubInfo.goalsAgainst}</Text>
                </View>
              </CardLayout>
            </VStack>
          </>
        }
      </ScrollView> 
    </View>
  );
}

const styles = StyleSheet.create({
  vStackContainer: {
    width: '85%',
  },
  container: {
    flex: 1,
    backgroundColor: '#25292e',
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
  nameContainer: {
    flexDirection: 'row', 
  },
  errorText: {
    color: 'red',
    fontSize: 18,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginVertical: 8,
  },
  playerDetails: {
    fontSize: 20,
    color: '#ffffff',
  },
  playerStat: {
    fontSize: 20,
    color: '#ffffff',
    textAlign: 'right',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
});
