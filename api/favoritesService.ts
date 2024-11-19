import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import * as MediaLibrary from 'expo-media-library';
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

// export const exportFavorites = async (favoritesList: ClubInfoType[]) : Promise<string> => {
//     try {
//         const exportPath = `${FileSystem.documentDirectory}exported_favorites.json`;
//         await FileSystem.writeAsStringAsync(exportPath, JSON.stringify(favoritesList, null, 2));
//         return exportPath;
//     } catch (err) {
//         console.error('Error reading favorites file:', err);
//         throw new Error('Failed to export favorites.');
//     } 
// };

export const exportFavorites = async (favoritesList: ClubInfoType[]): Promise<void> => {
    try {
      const exportPath = `${FileSystem.documentDirectory}exported_favorites.json`;
  
      // Save file in internal file system of the app
      await FileSystem.writeAsStringAsync(exportPath, JSON.stringify(favoritesList, null, 2));
      console.log('File stored in:', exportPath);
  
      if (Platform.OS === 'ios') {
        if (await Sharing.isAvailableAsync()) {
            // Enable share prompt (send via WhatsApp, Gmail, Facebook, etc.)
            await Sharing.shareAsync(exportPath, {
              mimeType: 'application/json',
              dialogTitle: 'Export file',
              UTI: 'public.item',   // On iOS, the UTI “public.item” is a generic type that tells iOS the file is some type of file, which can be saved to the user’s filesystem
            });
            console.log('Export successful');
        } else {
            console.log('Sharing not available in this device.');
        }
      } else {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== 'granted') {
            console.log('Media library permissions not granted.');
            return;
        }
        const asset = await MediaLibrary.createAssetAsync(exportPath);
        const album = await MediaLibrary.getAlbumAsync('Download');
        if (album == null) {
            await MediaLibrary.createAlbumAsync('Download', asset, false);
        } else {
            await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
        }
      }
      
    } catch (err) {
      console.error('Error:', err);
    }
};

/*
export const exportFavorites = async (favoritesList: ClubInfoType[]): Promise<void> => {
    try {
      const jsonData = JSON.stringify(favoritesList, null, 2);
  
      // User can pick folder (only works in Android)
      const documentPickerResult = await DocumentPicker.getDocumentAsync({
        type: 'application/json',
        copyToCacheDirectory: true,
      });
  
      if (documentPickerResult.canceled) {
        console.log('User didn\'t select folder');
        return;
      }
  
      console.log("documentPickerResult.assets[0] = ", documentPickerResult.assets[0]);

      const destinationUri = '/';
  
      await FileSystem.writeAsStringAsync(destinationUri, jsonData);
      console.log(`File saved in: ${destinationUri}`);
    } catch (err) {
      console.error('Error :', err);
    }
};
*/