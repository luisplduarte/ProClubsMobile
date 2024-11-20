import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';
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

/**
 * Function that exports favorites clubs list to PDF
 * @param favoritesList clubs added to favorites by the user
 */
export const exportFavorites = async (favoritesList: ClubInfoType[]): Promise<string> => {
    try {
      const htmlContent = `
        <html>
          <head>
            <title>Favorites</title>
          </head>
          <body>
            <h1>Favorite Clubs</h1>
            <ul>
              ${favoritesList.map(club => `<li><strong>${club.name}</strong> (${club.id})</li>`).join('')}
            </ul>
          </body>
        </html>
      `;
  
      // Generate a PDF file from the HTML content
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
  
      // For iOS
      if (Platform.OS === 'ios') {
        // Check if sharing functionality is available on the device
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(uri, {UTI: 'public.item'});  // Share the PDF file using the device's share dialog
        } else {
          throw new Error('Sharing not available on this device.');
        }
      } else {
        // For Android
        const { status } = await MediaLibrary.requestPermissionsAsync();    // Request media library permissions
        if (status !== 'granted') {
          throw new Error('Media library permissions not granted.');
        }

        const asset = await MediaLibrary.createAssetAsync(uri); // Create a media asset for the PDF file
        const album = await MediaLibrary.getAlbumAsync('Download');
        if (!album) await MediaLibrary.createAlbumAsync('Download', asset, false);
        else await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      }

      return uri;

    } catch (err) {
      console.error('Error exporting favorites as PDF:', err);
      throw new Error('Failed to export favorites');
    }
};
