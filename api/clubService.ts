import api from '../utils/axiosConfig';
import { checkIsFavorite } from './favoritesService';

export const fetchClubInfo = async (clubId: string = '158176') => {
    const response = await api.get(`/clubs/${clubId}`);
    const clubInfo = response.data;
    clubInfo.isFavorite = await checkIsFavorite(clubInfo.id);
    return clubInfo;
};

export const fetchClubByName = async (clubName: string) => {
    const response = await api.get(`/clubs/name/${clubName}`);
    return response.data;
};

export const fetchClubPlayers = async (clubId: string = '158176') => {
    const response = await api.get(`/clubs/${clubId}/players`);
    return response.data;
};

export const fetchPlayerByName = async (playerName: string, clubId: string = '158176') => {
    const response = await api.get(`/clubs/${clubId}/players/${playerName}`);
    return response.data;
};