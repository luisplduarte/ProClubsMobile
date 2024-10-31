import api from '../utils/axiosConfig';

export const fetchClubInfo = async (clubId: string = '158176') => {
    const response = await api.get(`/clubs/${clubId}`);
    console.log("response.data = ", response.data)
    return response.data;
};

export const fetchClubPlayers = async (clubId: string = '158176') => {
    const response = await api.get(`/clubs/${clubId}/players`);
    console.log("club players = ", response.data)
    return response.data;
};