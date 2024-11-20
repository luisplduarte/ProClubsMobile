import { View, StyleSheet, Text, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import { useQuery, useMutation } from '@tanstack/react-query';
import { exportFavorites, fetchFavoriteClubs } from '../../api/favoritesService';
import { ClubInfo as ClubInfoType } from '../../types/ClubInfoTypes';
import CardLayout from '@/components/cards/CardLayout';
import Button from '@/components/Button';
import CustomToast from '@/components/CustomToast';
import { ToastTypes } from '@/types/ToastTypes';

const { width: screenWidth } = Dimensions.get('window');

export default function ClubFavorites() {
  const router = useRouter();  
  const { data: favorites, isLoading, error } = useQuery<ClubInfoType[], Error>(
    {
      queryKey: ['favoriteClubs'],
      queryFn: () => fetchFavoriteClubs(),
      refetchOnMount: true,
    }
  );

  const exportFavoritesMutation = useMutation({
    mutationFn: (favorites: ClubInfoType[] ) => exportFavorites(favorites || null),
    onSuccess: (exportPath: string) => {
      CustomToast({ 
        type: ToastTypes.SUCCESS, 
        title: 'Action Successful', 
        message: `Favorites exported to: ${exportPath}`
      });
    },
    onError: () => {
      CustomToast({ 
        type: ToastTypes.ERROR, 
        title: 'Action Failed', 
        message: 'An error occurred while exporting favorites.'
      });
    },
  });

  const handleExportFavorites = async () => {
    if (favorites && favorites.length) exportFavoritesMutation.mutate(favorites);
  };

  const handleClubClicked = (clubId: string) => {
    router.push(`/clubDetails?id=${clubId}`);
  }

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
        <Button 
          label="Export" 
          onPress={handleExportFavorites} 
          disabled={!favorites || !favorites.length} 
          style={{
            width: screenWidth / 2 - 16,
            flex: 1,
            opacity: !favorites || !favorites.length ? 0.6 : 1,
          }}
        />
        {favorites && favorites.length ? favorites.map((club) => {
          return (
            <CardLayout style={styles.card} onClick={() => handleClubClicked(club.id)} key={club.id}>
              <View>
                <Text style={styles.text}>{club.name}</Text>
              </View>
            </CardLayout>
          )}) : 
          <Text style={styles.title}>You don't have any favorite clubs.</Text>
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
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
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
});
