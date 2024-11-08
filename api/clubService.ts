import api from '../utils/axiosConfig';

export const fetchClubInfo = async (clubId: string = '158176') => {
    const response = await api.get(`/clubs/${clubId}`);
    return response.data;
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
    console.log("Player = ", response.data)
    return response.data;
};