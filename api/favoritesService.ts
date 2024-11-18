import * as FileSystem from 'expo-file-system';
import { ClubInfo as ClubInfoType } from '@/types/ClubInfoTypes';

const FAVORITES_FILE_PATH = `${FileSystem.documentDirectory}favorites.json`;

export const fetchFavoriteClubs = async () : Promise<ClubInfoType[]> => {
    try {
        const favoritesFile = await FileSystem.getInfoAsync(FAVORITES_FILE_PATH);
        if (favoritesFile.exists) {
          const fileContents = await FileSystem.readAsStringAsync(FAVORITES_FILE_PATH);
          const parsedFavorites: ClubInfoType[] = JSON.parse(fileContents);
          return parsedFavorites;
        } else {
          // File doesn't exist, create empty one
          await FileSystem.writeAsStringAsync(FAVORITES_FILE_PATH, JSON.stringify([]));
          return []; 
        }
    } catch (err) {
        console.error('Error reading favorites file:', err);
        throw new Error('Failed to load favorite clubs.');
    } 
};

export const addClubToFavorites = async (newClub: ClubInfoType): Promise<ClubInfoType | null> => {
    try {
        const currentFavorites = await fetchFavoriteClubs();
        
        // Check for duplicates
        const isAlreadyFavorite = currentFavorites.some(club => club.id === newClub.id);
        if (isAlreadyFavorite) {
            console.warn('Club is already in favorites.');
            return null;
        }
        
        const updatedFavorites = [...currentFavorites, newClub];
        await FileSystem.writeAsStringAsync(FAVORITES_FILE_PATH, JSON.stringify(updatedFavorites));
        console.log('Club added to favorites successfully.');
        
        return {...newClub, isFavorite: !newClub.isFavorite };
    } catch (err) {
        console.error('Error adding club to favorites:', err);
        throw new Error('Failed to add club to favorites.');
    }
};

export const removeClubFromFavorites = async (club: ClubInfoType): Promise<ClubInfoType | null> => {
    try {
        const currentFavorites = await fetchFavoriteClubs();
        const updatedFavorites = currentFavorites.filter(auxClub => auxClub.id !== club.id);
        if (updatedFavorites.length === currentFavorites.length) {
            console.warn('Club not found in favorites.');
            return null;
        }

        await FileSystem.writeAsStringAsync(FAVORITES_FILE_PATH, JSON.stringify(updatedFavorites));
        return {...club, isFavorite: !club.isFavorite };
    } catch (err) {
        console.error('Error removing club from favorites:', err);
        throw new Error('Failed to remove club from favorites.');
    }
};

export const checkIsFavorite = async (clubId: string) : Promise<boolean> => {
    try {
        const favoritesFile = await FileSystem.getInfoAsync(FAVORITES_FILE_PATH);
        if (!favoritesFile.exists) return false;

        const fileContents = await FileSystem.readAsStringAsync(FAVORITES_FILE_PATH);
        const parsedFavorites: ClubInfoType[] = JSON.parse(fileContents);
        return parsedFavorites.some(club => club.id === clubId);
    } catch (err) {
        console.error('Error reading favorites file:', err);
        throw new Error('Failed to check if the club is a favorite.');
    } 
};